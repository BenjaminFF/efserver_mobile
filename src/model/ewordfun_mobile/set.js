module.exports = class extends think.Model {
    //在创建的时候，默认让创建者成为使用者
    async create(origin_id, authorid, name, description, terms) {
        try {
            let termDB = await this.model('term').db(this.db());
            let set_termDB = await this.model('set_term').db(this.db());
            await this.startTrans();
            let set = {
                origin_id,
                name,
                description,
                term_count: terms.length,
                uid: authorid,
                authorid,
                createtime: Date.now()
            }
            let sid = await this.add(set);
            let tids = await termDB.addMany(terms);
            let set_terms = [];
            tids.forEach((tid) => {
                set_terms.push({tid, sid});
            });
            await set_termDB.addMany(set_terms);
            await this.commit();
            return sid;
        } catch (e) {
            await this.rollback();
            throw e;
        }
    }

    async share(set, old_sid) {
        try {
            let set_termDB = await this.model('set_term').db(this.db());
            await this.startTrans();
            let sid = await this.add(set);
            let set_terms=await set_termDB.where({sid:old_sid}).select();
            let new_set_terms = [];
            set_terms.forEach((set_term) => {
                new_set_terms.push({tid:set_term.tid, sid});
            });
            await set_termDB.addMany(set_terms);
            await this.commit();
            return sid;
        } catch (e) {
            await this.rollback();
            throw e;
        }
    }

    async remove(sid) {
        try {
            let vocabularyDB = await this.model('vocabulary').db(this.db());
            let recordDB = await this.model('v_record').db(this.db());
            let set_userDB = await this.model('set_user').db(this.db());
            await this.startTrans();
            await this.where({sid: sid}).delete();
            await vocabularyDB.where({sid: sid}).delete();
            await recordDB.where({sid: sid}).delete();
            await set_userDB.where({sid: sid}).delete();
            await this.commit();
        } catch (e) {
            await this.rollback();
        }
    }

    async acquire(sid, uid) {
        try {
            let vocabularyDB = await this.model('vocabulary').db(this.db());
            let recordDB = await this.model('v_record').db(this.db());
            let set_userDB = await this.model('set_user').db(this.db());
            await this.startTrans();
            let set = await this.where({sid: sid}).find();
            let setRecord = await set_userDB.where({uid: uid, sid: sid}).find();
            set.rwrite = setRecord.rwrite;
            set.rmatrix = setRecord.rmatrix;
            let vocabularies = await vocabularyDB.where({sid: sid}).select();
            let records = await recordDB.where({sid: sid, uid: uid}).select();
            vocabularies.forEach((vocabulary) => {
                records.forEach((record) => {
                    if (vocabulary.vid == record.vid) {
                        vocabulary.rmatrix = record.rmatrix;
                        vocabulary.rflashcard = record.rflashcard;
                        vocabulary.rwrite = record.rwrite;
                        vocabulary.rid = record.rid;
                        vocabulary.rmatrix_unpass_count = record.rmatrix_unpass_count;
                    }
                });
            });
            await this.commit();
            return {
                set: set,
                vocabularies: vocabularies
            }
        } catch (e) {
            await this.rollback();
            console.log(e);
        }
    }

    //updateSV include vocabularies
    async updateSV(set, vocabularies) {
        try {
            let vocabularyDB = await this.model('vocabulary').db(this.db());
            vocabularyDB._pk = 'vid';
            await this.startTrans();
            await this.where({sid: set.sid}).update(set);
            await vocabularyDB.updateMany(vocabularies);
            await this.commit();
        } catch (e) {
            await this.rollback();
            console.log(e);
        }
    }

    async listOfUser(uid) {
        let set_userDB = await this.model('set_user').db(this.db());
        let sets = await set_userDB.join({
            table: 'set',
            join: 'inner',
            on: ['sid', 'sid']
        }).where({uid: uid}).select();
        return sets;
    }

    async updateRecord(setRecord) {
        let set_userDB = await this.model('set_user').db(this.db());
        await set_userDB.where({uid: setRecord.uid, sid: setRecord.sid}).update(setRecord);
    }
};

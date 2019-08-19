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

            terms.forEach((term) => {
                term.origin_id = origin_id;
            })
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

    async share(set) {
        try {
            let set_termDB = await this.model('set_term').db(this.db());
            let termDB = await this.model('term').db(this.db());
            await this.startTrans();
            let sid = await this.add(set);
            let terms = await termDB.where({origin_id: set.origin_id}).select();
            console.log(terms);
            let new_set_terms = [];
            terms.forEach((term) => {
                new_set_terms.push({tid: term.tid, sid});
            });
            await set_termDB.addMany(new_set_terms);
            await this.commit();
            return sid;
        } catch (e) {
            await this.rollback();
            throw e;
        }
    }

    async acquire(sid, origin_id) {
        try {
            let termDB = await this.model('term').db(this.db());
            let set_termDB = await this.model('set_term').db(this.db());
            await this.startTrans();
            let set = await this.where({sid}).find();
            let terms = await termDB.where({origin_id}).select();
            let set_terms = await set_termDB.where({sid}).select();
            set_terms.forEach((set_term) => {
                terms.forEach((term) => {
                    if (term.tid == set_term.tid) {
                        term.spell_comb_learned = set_term.spell_comb_learned;
                        term.write_learned = set_term.write_learned;
                        term.stared = set_term.stared;
                    }
                })
            })
            await this.commit();
            return {
                set: set,
                terms: terms
            }
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
};

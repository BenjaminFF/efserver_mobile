module.exports = class extends think.Model {
    //在创建的时候，默认让创建者成为使用者    ok
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

    //ok
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

    //ok
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

    //先保留，后面加了权限再改
    async remove(sid) {
        try {
            let set_termDB = await this.model('set_term').db(this.db());
            await this.startTrans();
            await set_termDB.where({sid}).delete();
            await this.where({sid}).delete();
            await this.commit();
            return sid;
        } catch (e) {
            await this.rollback();
            throw e;
        }
    }
};

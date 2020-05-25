/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable camelcase */
module.exports = class extends think.Model {
  // 在创建的时候，默认让创建者成为使用者    ok
  async create(origin_id, authorid, name, description, terms) {
    try {
      const termDB = await this.model('term').db(this.db());
      const set_termDB = await this.model('set_term').db(this.db());
      await this.startTrans();
      const set = {
        origin_id,
        name,
        description,
        term_count: terms.length,
        uid: authorid,
        authorid,
        startplantime: Date.now(),
        createtime: Date.now()
      };
      const sid = await this.add(set);

      terms.forEach((term) => {
        term.origin_id = origin_id;
        term.authorid = authorid;
      });
      const tids = await termDB.addMany(terms);
      const set_terms = [];
      tids.forEach((tid) => {
        set_terms.push({ tid, sid, uid: authorid });
      });
      await set_termDB.addMany(set_terms);
      await this.commit();
      return sid;
    } catch (e) {
      await this.rollback();
      throw e;
    }
  }

  // ok
  async share(set) {
    try {
      const set_termDB = await this.model('set_term').db(this.db());
      const termDB = await this.model('term').db(this.db());
      await this.startTrans();
      const sid = await this.add(set);
      const terms = await termDB.where({ origin_id: set.origin_id }).select();
      console.log(terms);
      const new_set_terms = [];
      terms.forEach((term) => {
        new_set_terms.push({ tid: term.tid, sid, uid: set.uid });
      });
      await set_termDB.addMany(new_set_terms);
      await this.commit();
      return sid;
    } catch (e) {
      await this.rollback();
      throw e;
    }
  }

  // ok
  async acquire(sid, origin_id) {
    try {
      const termDB = await this.model('term').db(this.db());
      const set_termDB = await this.model('set_term').db(this.db());
      await this.startTrans();
      const set = await this.where({ sid, origin_id }).find();
      if (think.isEmpty(set)) {
        await this.rollback();
        return {
          errno: 401,
          errmsg: '该单词集不存在'
        };
      }
      const terms = await termDB.where({ origin_id }).select();
      const set_terms = await set_termDB.where({ sid }).select();
      set_terms.forEach((set_term) => {
        terms.forEach((term) => {
          if (term.tid == set_term.tid) {
            term.multichoice_learned = set_term.multichoice_learned;
            term.wordcomb_learned = set_term.wordcomb_learned;
            term.wordspell_learned = set_term.wordspell_learned;
            term.stared = set_term.stared;
          }
        });
      });
      await this.commit();
      return {
        errno: 0,
        set: set,
        terms: terms
      };
    } catch (e) {
      await this.rollback();
      throw e;
    }
  }

  async remove(sid, origin_id) {
    try {
      const set_termDB = await this.model('set_term').db(this.db());
      await this.startTrans();
      await set_termDB.where({ sid }).delete();
      await this.where({ sid }).delete();
      const sets = await this.where({ origin_id }).select();
      if (think.isEmpty(sets)) { // 如果该单词集没有使用者
        const termDB = await this.model('term').db(this.db());
        await termDB.where({ origin_id }).delete();
      }
      await this.commit();
    } catch (e) {
      await this.rollback();
      throw e;
    }
  }
};

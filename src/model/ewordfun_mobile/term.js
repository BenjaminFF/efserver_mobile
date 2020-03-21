/* eslint-disable no-console */
/* eslint-disable camelcase */
module.exports = class extends think.Model {
  beforeUpdate(data) {
    for (const key in data) {
      // 如果值为空则不更新
      if (!data[key]) {
        delete data[key];
      }
    }
    return data;
  }

  async mAdd(origin_id, authorid, term, definition) {
    try {
      const setDB = await this.model('set').db(this.db());
      const sets = await setDB.where({origin_id, authorid}).select();

      if (think.isEmpty(sets)) {
        return {
          errno: 401,
          errmsg: '不存在该单词集'
        };
      }

      await this.startTrans();
      await setDB.where({origin_id}).increment({term_count: 1});
      const tid = await this.add({origin_id, term, definition, authorid});
      const set_termDB = await this.model('set_term').db(this.db());
      for (let i = 0; i < sets.length; i++) {
        await set_termDB.add({tid, sid: sets[i].sid, uid: sets[i].uid});
      }
      await this.commit();

      return {
        tid,
        errno: 0,
        errmsg: '添加term成功'
      };
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  async mDelete(tid, origin_id, authorid) {
    try {
      const setDB = await this.model('set').db(this.db());
      const set = await setDB.where({origin_id, authorid}).find();
      if (think.isEmpty(set)) {
        return {
          errno: 401,
          errmsg: '不存在该单词集'
        };
      }

      if (set.term_count <= 7) {
        return {
          errno: 401,
          errmsg: '单词集的术语数量不能小于7'
        };
      }

      await this.startTrans();
      await setDB.where({origin_id}).decrement({term_count: 1});
      const set_termDB = await this.model('set_term').db(this.db());
      await set_termDB.where({tid}).delete();
      await this.where({tid}).delete();
      await this.commit();
      return {
        errno: 0,
        errmsg: '删除term成功'
      };
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}

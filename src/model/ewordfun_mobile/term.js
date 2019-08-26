/* eslint-disable camelcase */
module.exports = class extends think.Model {
  beforeUpdate(data) {
    for (const key in data) {
      // 如果值为空则不更新
      if (data[key] === '') {
        delete data[key];
      }
    }
    return data;
  }

  async mAdd(sid, uid, term, definition) {
    try {
      const setDB = await this.model('set').db(this.db());
      const set = await setDB.where({sid, uid}).find();

      if (think.isEmpty(set)) {
        return {
          errno: 401,
          errmsg: '不存在该单词集'
        };
      }
      await this.startTrans();
      await setDB.where({sid}).increment({term_count: 1});
      const tid = await this.add({origin_id: set.origin_id, term, definition, authorid: uid});
      const set_termDB = await this.model('set_term').db(this.db());
      await set_termDB.add({sid, tid, uid});
      await
      await this.commit();

      return {
        errno: 0,
        errmsg: '添加term成功'
      };
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }
}
;

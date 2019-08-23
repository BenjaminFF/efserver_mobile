/* eslint-disable no-console */
/* eslint-disable camelcase */
module.exports = class extends think.Model {
  beforeUpdate(data) {
    for (const key in data) {
      // 如果值为空则不更新
      if (data[key] === undefined) {
        delete data[key];
      }
    }
    return data;
  }

  async listSet(fid) {
    try {
      const folder_setDB = await this.model('folder_set').db(this.db());
      const setDB = await this.model('set').db(this.db());
      const sids = await folder_setDB.where({fid: fid}).getField('sid');
      console.log(sids);
      const sets = await setDB.where({sid: ['IN', sids]}).select();
      return sets;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addSet(fid, sid, authorid) {
    try {
      const folder = await this.where({fid, authorid}).find();
      if (think.isEmpty(folder)) {
        return {
          errno: 401,
          errmsg: '该folder不存在或folder不属于该用户'
        };
      }

      const setDB = await this.model('set').db(this.db());
      const set = await setDB.where({sid, uid: authorid}).find();
      if (think.isEmpty(set)) {
        return {
          errno: 401,
          errmsg: '该set不存在或set不属于该用户'
        };
      }

      const folder_setDB = await this.model('folder_set').db(this.db());
      await folder_setDB.add({sid, fid});
      return {
        errno: 0,
        errmsg: '添加单词集成功'
      };
    } catch (e) {
      throw e;
    }
  }

  async removeSet(fid, sid, authorid) {
    try {
      const folder = await this.where({fid, authorid}).find();
      if (think.isEmpty(folder)) {
        return {
          errno: 401,
          errmsg: '该folder不存在或folder不属于该用户'
        };
      }

      const setDB = await this.model('set').db(this.db());
      const set = await setDB.where({sid, uid: authorid}).find();
      if (think.isEmpty(set)) {
        return {
          errno: 401,
          errmsg: '该set不存在或set不属于该用户'
        };
      }

      const folder_setDB = await this.model('folder_set').db(this.db());
      await folder_setDB.where({fid, sid}).delete();
      return {
        errno: 0,
        errmsg: '删除单词集成功'
      };
    } catch (error) {
      throw error;
    }
  }
};

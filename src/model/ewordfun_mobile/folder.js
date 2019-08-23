module.exports = class extends think.Model {
  beforeUpdate(data) {
    for (const key in data) {
      // 如果值为空则不更新
      if(data[key] === undefined) {
        delete data[key];
      }
    }
    return data;
  }

  async listSet(fid){
    try {
      let folder_setDB = await this.model('folder_set').db(this.db());
      let setDB=await this.model('set').db(this.db());
      let sids=await folder_setDB.where({fid:fid}).getField('sid');
      console.log(sids);
      let sets=await setDB.where({sid:['IN',sids]}).select();
      return sets;
    }catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addSet(fid,sid,authorid){
    try{
      let folder = await this.where({fid, authorid}).find();
      if (think.isEmpty(folder)) {
        return {
          errno:401,
          errmsg:'该folder不存在或folder不属于该用户'
        };
      }

      let setDB = await this.model('set').db(this.db());
      let set = await setDB.where({sid, uid:authorid}).find();
      if (think.isEmpty(set)) {
        return {
          errno:401,
          errmsg:'该set不存在或set不属于该用户'
        };
      }

      let folder_setDB = await this.model('folder_set').db(this.db());
      await folder_setDB.add({sid,fid});
      return {
        errno:0,
        errmsg:"添加单词集成功"
      }
    }catch (e) {
      throw e;
    }
  }
}

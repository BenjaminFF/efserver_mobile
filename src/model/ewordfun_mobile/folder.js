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
    let folderSetDB = await this.model('folder_set').db(this.db());
    let sids=await folderSetDB.where({fid:fid}).getField('sid');
    return sids;
  }
}

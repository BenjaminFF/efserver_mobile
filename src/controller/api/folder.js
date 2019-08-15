const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/folder');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  async listAction() {
    try{
      let authorid = this.ctx.post('authorid');
      let data = await model.where({authorid: authorid}).select();
      this.success(data);
    }catch (e) {
      this.fail(403,'mysql异常');
    }
  }

  async addAction() {
    try{
      let fid=await model.add({
        name: this.ctx.post('name'),
        description: this.ctx.post('description'),
        authorid: this.ctx.post('authorid'),
        createtime: Date.now()
      });
      this.success({fid:fid},'添加数据成功');
    }catch (e) {
      this.fail(403,'mysql异常');
    }
  }

  async updateAction() {
    try{
      let folder = {
        name: this.ctx.post('name'),
        description: this.ctx.post('description')
      };
      let fid=await model.where({fid: this.ctx.post('fid')}).update(model.beforeUpdate(folder));
      await this.success({fid:fid},'修改folder成功');
    }catch (e) {
      this.fail(403,'mysql异常');
    }
  }

  async addSetAction() {

  }

  async listSetAction(){
    console.log(this.ctx.query.fid);
    this.body=await model.listSet(this.ctx.query.fid);
  }

  async deleteAction() {
    await model.where({fid: this.ctx.post('fid')}).delete();
  }
};

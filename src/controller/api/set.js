const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/set');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }
  //create set indicates that it's vocabulary will be created, and record will be initialized.
  createAction() {
    let authorid = this.cookie('uid');
    let set=JSON.parse(this.ctx.post('set'));
    let vocabularies=JSON.parse(this.ctx.post('vocabularies'));

    set.createtime=Date.now();
    set.authorid=authorid;
    set.vcount=vocabularies.length;

    model.create(set,vocabularies,authorid);
  }
  //remove set indicates that it's vocabularies and records about user will be removed too.
  removeAction(){
    model.remove(this.ctx.post('sid'));
  }

  async acquireAction(){
    console.log(uniqid.process());
    this.body=await model.acquire(this.ctx.query.sid,this.ctx.query.uid);
  }

  //update set and vocabularies both
  updateSVAction(){
    let set=JSON.parse(this.ctx.post('set'));
    let vocabularies=JSON.parse(this.ctx.post('vocabularies'));
    console.log(vocabularies);
    set.vcount=vocabularies.length;     //!important
    model.updateSV(set,vocabularies);
  }

  //update set info
  async updateAction(){
    let set=JSON.parse(this.ctx.post('set'));
    await model.where({sid:set.sid}).update(set);
  }

  //this will be modified after the set can be shared.
  async list_of_authorAction(){
    let authorid = this.ctx.cookie('uid');
    this.body=await model.where({authorid:authorid}).select();
  }

  //this will be modified after the set can be shared.
  async list_of_userAction(){
    let uid = this.ctx.cookie('uid');
    this.body=await model.listOfUser(uid);
  }

  //update set's record, if you finish a round of matrix or write etc.
  async updateRecordAction(){
    let setRecord=JSON.parse(this.ctx.post('setRecord'));
    model.updateRecord(setRecord);
  }
}

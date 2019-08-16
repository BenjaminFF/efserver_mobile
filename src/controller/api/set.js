const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/set');
module.exports = class extends think.Controller {
    __before() {
        //添加权限
    }

    //create set indicates that it's vocabulary will be created, and record will be initialized.
    async createAction() {
        let authorid = this.ctx.post('authorid');
        let name = this.ctx.post('name');
        let description = this.ctx.post('description');
        let terms = JSON.parse(this.ctx.post('terms'));
        try {
            let sid=await model.create(authorid, name, description, terms);
            await this.success({sid},'创建Set成功');
        }catch (e) {
            this.fail(403,"数据库异常");
        }
    }

    async shareAction() {
        let authorid = this.ctx.post('authorid');
        let uid = this.ctx.post('uid');
        let sid=this.ctx.post('sid');
        let data=await model.where({authorid,uid}).select();
        if(think.isEmpty(data)){

            let set={
                name:data.name,
                description:data.description
            }
            await model.add()
        }else {
            this.fail(401,"用户已存在该单词集");
        }
    }

    //remove set indicates that it's vocabularies and records about user will be removed too.
    removeAction() {
        model.remove(this.ctx.post('sid'));
    }

    async acquireAction() {
        console.log(uniqid.process());
        this.body = await model.acquire(this.ctx.query.sid, this.ctx.query.uid);
    }

    //update set and vocabularies both
    updateSVAction() {
        let set = JSON.parse(this.ctx.post('set'));
        let vocabularies = JSON.parse(this.ctx.post('vocabularies'));
        set.vcount = vocabularies.length;     //!important
        model.updateSV(set, vocabularies);
    }

    //update set info
    async updateAction() {
        let set = JSON.parse(this.ctx.post('set'));
        await model.where({sid: set.sid}).update(set);
    }

    //this will be modified after the set can be shared.
    async list_of_authorAction() {
        let authorid = this.ctx.cookie('uid');
        this.body = await model.where({authorid: authorid}).select();
    }

    //this will be modified after the set can be shared.
    async list_of_userAction() {
        let uid = this.ctx.cookie('uid');
        this.body = await model.listOfUser(uid);
    }

    //update set's record, if you finish a round of matrix or write etc.
    async updateRecordAction() {
        let setRecord = JSON.parse(this.ctx.post('setRecord'));
        model.updateRecord(setRecord);
    }
}

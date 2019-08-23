const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/folder');
module.exports = class extends think.Controller {
    __before() {
        //添加权限
    }

    //ok了
    async listAction() {
        try {
            let authorid = this.ctx.cookie('uid');
            let data = await model.where({authorid: authorid}).select();
            this.success(data, '列表查询成功');
        } catch (e) {
            this.fail(403, '数据库异常');
        }
    }

    //ok了
    async addAction() {
        try {
            let fid = await model.add({
                name: this.ctx.post('name'),
                description: this.ctx.post('description'),
                authorid: this.ctx.cookie('uid'),
                createtime: Date.now()
            });
            this.success({fid}, '添加数据成功');
        } catch (e) {
            this.fail(403, '数据库异常');
        }
    }

    //ok了
    async updateAction() {
        try {
            let folder = {
                name: this.ctx.post('name'),
                description: this.ctx.post('description')
            };
            let fid = await model.where({
                fid: this.ctx.post('fid'),
                authorid: this.cookie('uid')
            }).update(model.beforeUpdate(folder));
            await this.success({fid}, '修改folder成功');
        } catch (e) {
            this.fail(403, '数据库异常');
        }
    }

    //只能add自己的set
    async addSetAction() {
        let fid = this.ctx.post('fid');
        let sid = this.ctx.post('sid');
        let authorid = this.ctx.cookie('uid');

        try{
          let data=await model.addSet(fid,sid,authorid);
          if(data.errno==0){
            this.success({fid,sid},data.errmsg);
          }else {
            this.fail(data.errno,data.errmsg);
          }
        }catch (e) {
          this.fail(403,"数据库异常");
        }
    }

    //list某个folder的set
    async listSetAction() {
        let fid = this.ctx.query.fid;
        let uid = this.ctx.cookie('uid');
        this.body = await model.listSet(this.ctx.query.fid);
    }


    async removeSetAction() {

    }

    async deleteAction() {
        await model.where({fid: this.ctx.post('fid')}).delete();
    }
};

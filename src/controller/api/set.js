const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/set');
module.exports = class extends think.Controller {
    __before() {
        //添加权限
    }

    //创建set、该set的term、该set的term记录  ok了
    async createAction() {
        let authorid = this.ctx.cookie('uid');
        let name = this.ctx.post('name');
        let origin_id = uniqid.process();
        let description = this.ctx.post('description');
        let terms = JSON.parse(this.ctx.post('terms'));
        try {
            let sid = await model.create(origin_id, authorid, name, description, terms);
            await this.success({sid}, '创建Set成功');
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //ok了
    async shareAction() {
        let authorid = this.ctx.post('authorid');
        let uid = this.ctx.cookie('uid');
        let origin_id = this.ctx.post('origin_id');
        let sets = await model.where({authorid, origin_id}).select();
        let existUser = sets.find((set) => set.uid == uid) != undefined;
        if (existUser) {
            this.fail(401, "用户已存在该单词集");
        } else if (sets.length == 0) {
            this.fail(401, "需要分享的单词集不存在");
        } else {
            let set = {
                origin_id: origin_id,
                name: sets[0].name,
                description: sets[0].description,
                term_count: sets[0].term_count,
                uid: uid,
                authorid: authorid,
                createtime: sets[0].createtime
            }
            try {
                let sid = await model.share(set);
                await this.success({sid}, '分享Set成功');
            } catch (e) {
                this.fail(403, "数据库异常");
            }
        }
    }

    //ok了
    async acquireAction() {
        try {
            let data = await model.acquire(this.ctx.query.sid, this.ctx.query.origin_id);
            if (data.errno == 0) {
                this.success({set: data.set, terms: data.terms}, '获取Set数据成功');
            } else {
                this.fail(data.errno, data.errmsg);
            }
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //ok了
    async listAction() {
        try {
            let uid = this.ctx.cookie('uid');
            let sets = await model.where({uid}).select();
            this.success({sets}, "查找sets成功");
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    ////set name和description只有用户(uid关联的)才能修改
    async updateAction() {
        try {
            let set = JSON.parse(this.ctx.post('set'));
            let authorid = this.ctx.cookie('uid');
            let updated = await model.where({origin_id: set.origin_id, authorid}).update(set);
            if (updated) {
                this.success({origin_id: set.origin_id}, "更新成功");
            } else {
                this.fail(401, "需要更新的单词集不存在或者该单词集的作者不属于该用户");
            }
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //set record只有用户(uid关联的)才能修改
    async updateRecordAction() {
        try {
            let set = JSON.parse(this.ctx.post('set'));
            let uid = this.ctx.cookie('uid');
            let updated = await model.where({sid: set.sid, uid}).update(set);
            if (updated) {
                this.success({sid:set.sid},"更新单词集记录成功");
            } else {
                this.fail(401, "需要更新的单词集不存在或者该单词集的作者不属于该用户");
            }
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //remove: 只删除set和set的记录（set_term）。如果该set已没有使用者，就删除它的term
    async removeAction() {
        try {
            let sid=this.ctx.post('sid');
            let origin_id=this.ctx.post('origin_id');
            let uid=this.ctx.cookie('uid');
            let set=await model.where({sid,origin_id,uid}).find();
            if(think.isEmpty(set)){
                this.fail(401,"需要删除的单词集不存在或者该单词集不属于该用户");
            }else {
                await model.remove(sid,origin_id);
                this.success({sid}, "删除单词集成功");
            }
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }
}

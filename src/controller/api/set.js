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

    async shareAction() {
        let authorid = this.ctx.post('authorid');
        let uid = this.ctx.post('uid');
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

    async acquireAction() {
        try {
            let data = await model.acquire(this.ctx.query.sid, this.ctx.query.origin_id);
            await this.success(data, '获取Set数据成功');
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //后面加了权限还要判断该单词集的作者是不是当前用户
    async updateAction() {
        try {
            let set = JSON.parse(this.ctx.post('set'));
            let updated = await model.where({sid: set.sid}).update(set);
            if (updated) {
                this.success({sid: set.sid}, "更新成功");
            } else {
                this.fail(401, "需要更新的单词集不存在或者该单词集的作者不属于该用户");
            }
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //
    async listAction() {
        try {
            let uid = this.ctx.query.uid;
            let sets = await model.where({uid: uid}).select();
            this.success({sets}, "查找sets成功");
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }

    //remove是删除当前用户的set和它在set_term里的记录，term不会删除, 后面加了权限也要还要判断该单词集的使用者是不是当前用户
    removeAction() {
        try {
            let sid=model.remove(this.ctx.post('sid'));
            this.success({sid:sid},"删除成功");
        } catch (e) {
            this.fail(403, "数据库异常");
        }
    }
}

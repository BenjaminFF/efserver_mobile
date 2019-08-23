/* eslint-disable no-unused-vars */
/* eslint-disable eqeqeq */
const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/folder');
module.exports = class extends think.Controller {
  __before() {
    // 添加权限
  }

  // ok了
  async listAction() {
    try {
      const authorid = this.ctx.cookie('uid');
      const data = await model.where({authorid: authorid}).select();
      this.success(data, '列表查询成功');
    } catch (e) {
      this.fail(403, '数据库异常');
    }
  }

  // ok了
  async addAction() {
    try {
      const fid = await model.add({
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

  // ok了
  async updateAction() {
    try {
      const folder = {
        name: this.ctx.post('name'),
        description: this.ctx.post('description')
      };
      const fid = await model.where({
        fid: this.ctx.post('fid'),
        authorid: this.cookie('uid')
      }).update(model.beforeUpdate(folder));
      await this.success({fid}, '修改folder成功');
    } catch (e) {
      this.fail(403, '数据库异常');
    }
  }

  // 只能add自己的set
  async addSetAction() {
    const fid = this.ctx.post('fid');
    const sid = this.ctx.post('sid');
    const authorid = this.ctx.cookie('uid');

    try {
      const data = await model.addSet(fid, sid, authorid);
      if (data.errno == 0) {
        this.success({fid, sid}, data.errmsg);
      } else {
        this.fail(data.errno, data.errmsg);
      }
    } catch (e) {
      this.fail(403, '数据库异常');
    }
  }

  // list某个folder的set
  async listSetAction() {
    const fid = this.ctx.query.fid;
    const authorid = this.ctx.cookie('uid');
    try {
      const folder = await model.where({fid, authorid}).find();
      if (think.isEmpty(folder)) {
        this.fail(401, '该folder不存在或者folder不属于该用户');
      } else {
        const sets = await model.listSet(this.ctx.query.fid);
        this.success(sets, '查询该folder的单词集成功');
      }
    } catch (e) {
      this.fail(403, '数据库异常');
    }
  }

  async removeSetAction() {
    const fid = this.ctx.post('fid');
    const sid = this.ctx.post('sid');
    const authorid = this.ctx.cookie('uid');
    try {
      const data = await model.removeSet(fid, sid, authorid);
      if (data.errno == 0) {
        this.success({fid, sid}, data.errmsg);
      } else {
        this.fail(data.errno, data.errmsg);
      }
    } catch (e) {
      this.fail(403, '数据库异常');
    }
  }

  async deleteAction() {
    await model.where({fid: this.ctx.post('fid')}).delete();
  }
};

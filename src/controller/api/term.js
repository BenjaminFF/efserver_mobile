/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable semi */
/* eslint-disable eol-last */
/* eslint-disable no-unused-vars */
const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/term');
module.exports = class extends think.Controller {
  __before() {
    // 添加权限
  }

  async addAction() {
    const origin_id = this.ctx.post('origin_id');
    const term = this.ctx.post('term');
    const definition = this.ctx.post('definition');
    const uid = this.ctx.cookie('uid');

    try {
      const data = await model.mAdd(origin_id, uid, term, definition);
      if (data.errno === 0) {
        this.success({tid: data.tid}, data.errmsg);
      } else {
        this.fail(data.errno, data.errmsg);
      }
    } catch (error) {
      this.fail(403, '数据库异常');
    }
  }

  async updateAction() {
    const tid = this.ctx.post('tid');
    const term = this.ctx.post('term');
    const definition = this.ctx.post('definition');
    const uid = this.ctx.cookie('uid');

    try {
      const affectedRows = await model.where({tid, authorid: uid}).update(model.beforeUpdate({term, definition}));
      this.success({affectedRows}, '更新成功');
    } catch (e) {
      this.fail(403, '数据库异常');
    }
  }

  async deleteAction() {
    const tid = this.ctx.post('tid');
    const origin_id = this.ctx.post('origin_id');
    const uid = this.ctx.cookie('uid');

    try {
      const data = await model.mDelete(tid, origin_id, uid);
      if (data.errno === 0) {
        this.success({tid}, data.errmsg);
      } else {
        this.fail(data.errno, data.errmsg);
      }
    } catch (error) {
      this.fail(403, '数据库异常');
    }
  }
}
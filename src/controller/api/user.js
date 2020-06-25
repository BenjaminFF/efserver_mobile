/* eslint-disable eqeqeq */
/* eslint-disable no-console */
/* eslint-disable camelcase */
const uniqid = require('uniqid');
const model = think.model('ewordfun_mobile/user');
const svgCaptcha = require('svg-captcha');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
module.exports = class extends think.Controller {
  async __before() {
    const nonce_urls = ['/api/user/login', '/api/user/validate']; // 需要保持每次请求唯一性的url
    if (nonce_urls.includes(this.ctx.url)) {
      const timestamp = this.ctx.post('timestamp');
      const nonce = this.ctx.post('nonce');
      if (Math.abs(Date.now() - timestamp) > 60 * 1000) {
        this.fail(406, '非法请求');
        return false;
      }
      const cache_nonce = await this.cache(nonce, undefined);
      if (cache_nonce == undefined) {
        await this.cache(nonce, nonce, {
          type: 'redis',
          redis: {
            timeout: 60 * 1000
          }
        });
      } else {
        this.fail(406, '非法请求');
        return false;
      }
    }
  }

  async addAction() {
    await model.add({
      uid: uniqid.process(),
      name: this.ctx.post('name'),
      password: think.md5(this.ctx.post('password')),
      email: this.ctx.post('email'),
      createtime: Date.now()
    });
  }

  async getCaptchaAction() {
    const captcha = svgCaptcha.create({
      size: 6,
      fontSize: 32,
      color: true,
      width: 200
    });
    console.log(captcha.text);
    this.body = captcha.data;
  }

  async loginAction() {
    const email = this.ctx.post('email');
    const password = think.md5(this.ctx.post('password'));
    try {
      const data = await model.where({ email: email, password: password }).find();
      if (think.isEmpty(data)) {
        this.fail(401, '账号或密码错误');
      } else {
        const loginTime = Date.now();
        const autoExpireTime = loginTime + 24 * 3600 * 1000 * 20;
        const userInfo = {
          uid: data.uid,
          loginTime,
          autoExpireTime,
          randomstring: randomstring.generate(12),
          uip: this.ctx.header['x-real-ip'],
        };
        const userToken = await this.cache(data.uid, undefined, 'redis');  //实现多点登录
        await this.cookie('uid', userInfo.uid, { maxAge: 24 * 3600 * 1000 * 20, httpOnly: false });
        let token = '';
        if (userToken !== undefined) {
          token = userToken;
        } else {
          token = think.md5(JSON.stringify(userInfo));
          await this.cache(userInfo.uid, think.md5(JSON.stringify(userInfo)), {
            type: 'redis',
            redis: {
              timeout: 24 * 3600 * 1000 * 20
            }
          });
        }
        await this.cookie(userInfo.uid, token, { maxAge: 24 * 3600 * 1000 * 20 });
        this.success({ email: data.email, name: data.name, uid: userInfo.uid, token }, '登录成功');
      }
    } catch (e) {
      console.log(e);
      this.fail(403, '数据库异常');
    }
  }

  async logoutAction() {
    const uid = await this.cookie('uid');
    await this.cache(uid, null, 'redis');
    await this.cookie('uid', null);
    await this.cookie(uid, null);
    this.success('登出成功');
  }

  async validateAction() {
    const uid = this.ctx.cookie('uid');
    const userInfo = await this.cache(uid, undefined, 'redis');
    const session_userInfo = await this.session(uid);
    if (userInfo == session_userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      parsedUserInfo.loginTime = Date.now();
      // 更新session和redis里面的userInfo
      await this.cache(uid, JSON.stringify(parsedUserInfo), 'redis');
      await this.session(uid, JSON.stringify(parsedUserInfo));
      this.body = { validated: true };
    } else {
      this.body = { validated: false };
    }
  }

  // -1 用户未注册 -2 邮件发送失败 1 邮件发送成功
  async sendPWChangeMailAction() { // 需要做是否存在该用户验证
    const email = this.ctx.post('email');
    const user = await model.where({ email: email }).find();
    if (think.isEmpty(user)) {
      this.body = { msg: '用户不存在，请注册', code: -1 };
      return;
    }
    const uniqidmd5 = think.md5(uniqid.process());
    const mLink = '<a href="http://127.0.0.1:8360/api/user/resetPassword/' + user.uid + '-' + uniqidmd5 + '">http://127.0.0.1:8360/api/user/resetPassword/' + user.uid + '-' + uniqidmd5 + '</a>';
    this.assign({
      user: user.name,
      mLink: mLink
    });
    const reset_pw_email = await this.render('reset_pw_email');
    const transporter = nodemailer.createTransport({
      host: 'smtp.ewordfun_mobile.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'admin@ewordfun_mobile.com', // generated ethereal user
        pass: 'Iamaman.' // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false // 拒绝不在服务端授权列表内的连接
      }
    });
    const mailOptions = {
      from: 'ewordfun_mobile<admin@ewordfun_mobile.com>', // 如果不加<xxx@xxx.com> 会报语法错误
      to: '990460889@qq.com', // list of receivers
      subject: '重置你在ewordfun的密码', // Subject line
      html: reset_pw_email
    };
    const sendInfo = await transporter.sendMail(mailOptions);
    if (sendInfo.accepted.length != 0) { // 发送失败的还没有测试
      await this.cache(user.uid + 'pwchange', uniqidmd5, { type: 'redis', redis: { timeout: 24 * 3600 * 1000 } });
      this.body = { msg: '邮件发送成功', code: 1 };
    } else {
      this.body = { msg: '邮件发送失败', code: -2 };
    }
  }

  async resetPasswordAction() {
    const uid_uniqidmd5 = this.ctx.url.split('/').pop();
    const uniqidmd5 = await this.ctx.cache(uid_uniqidmd5.split('-')[0] + 'pwchange', undefined, 'redis');
    console.log(uniqidmd5);
    this.assign({
      linkValid: uniqidmd5 !== undefined
    });
    this.body = await this.render('reset_password');
  }

  async updatePasswordAction() {
    const uid_uniqidmd5 = this.ctx.post('uid_uniqidmd5');
    const newPass = this.ctx.post('newPass');
    console.log(uid_uniqidmd5);
    const uid = uid_uniqidmd5.split('-')[0];
    const mUniqidmd5 = await this.ctx.cache(uid + 'pwchange', undefined, 'redis');
    if (mUniqidmd5 != undefined && mUniqidmd5 == uid_uniqidmd5.split('-')[1]) {
      await model.where({ uid: uid }).update({ password: think.md5(newPass) });
      await this.cache(uid + 'pwchange', null, 'redis');
      this.body = {
        msg: 'change pass success!',
        code: 1
      };
    } else {
      this.body = {
        msg: 'change pass failed!',
        code: -1
      };
    }
  }
};

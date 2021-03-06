/* eslint-disable spaced-comment */
/* eslint-disable no-console */
module.exports = class extends think.Logic {
  addAction() {
    const rules = {
      name: {
        string: true,
        required: true,
        method: 'post',
        length: {min: 2, max: 30}
      },
      password: {
        string: true,
        required: true,
        method: 'post',
        length: {min: 6, max: 32}
      },
      email: {
        required: true,
        email: true,
        method: 'post',
        length: {max: 64}
      }
    };
    return this.validate(rules);
    //return false;
  }

  loginAction() {
    const rules = {
      password: {
        string: true,
        required: true,
        method: 'post',
        length: {min: 6, max: 64}
      },
      email: {
        required: true,
        email: true,
        method: 'post',
        length: {max: 64}
      },
      timestamp: {
        required: true,
        int: true,
        method: 'post'
      },
      nonce: {
        string: true,
        required: true,
        method: 'post',
        length: {min: 12, max: 64}
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }

  validateAction() {

  }

  getCaptchaAction() {
    return false;
  }

  sendPWChangeMailAction() {
    const rules = {
      email: {
        required: true,
        email: true,
        method: 'post',
        length: {max: 64}
      }
    };
    if (!this.validate(rules)) {
      this.body = {
        msg: 'invalid email',
        code: '-5'
      };
      return false;
    }
  }

  updatePasswordAction() {
    const rules = {
      uid_uniqidmd5: {
        required: true,
        string: true,
        method: 'post'
      },
      newPass: {
        required: true,
        string: {min: 6, max: 32},
        method: 'post'
      }
    };
    if (!this.validate(rules)) {
      this.body = {
        msg: 'invalid info',
        code: '-5'
      };
      return false;
    }
  }
};

module.exports = class extends think.Logic {
  addAction() {
    let rules = {
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
    console.log(this.validate(rules));
    return this.validate(rules);
    //return false;
  }

  loginAction() {
    let rules = {
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
      }
    };
    return this.validate(rules);
  }

  validateAction() {

  }

  getCaptchaAction() {
    return false;
  }

  sendPWChangeMailAction() {
    let rules = {
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

  updatePasswordAction(){
    let rules = {
      uid_uniqidmd5: {
        required: true,
        string: true,
        method: 'post',
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



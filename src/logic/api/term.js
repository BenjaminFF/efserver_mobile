module.exports = class extends think.Logic {
  addAction() {
    const rules = {
      sid: {
        int: true,
        required: true,
        method: 'post'
      },
      term: {
        string: true,
        required: true,
        method: 'post',
        length: {min: 1, max: 32}
      },
      definition: {
        string: true,
        required: true,
        method: 'post',
        length: {max: 512}
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }

  updateAction() {
    const rules = {
      tid: {
        int: true,
        required: true,
        method: 'post'
      },
      term: {
        string: true,
        requiredWithOut: ['definition'],
        method: 'post',
        length: {min: 1, max: 32}
      },
      definition: {
        string: true,
        requiredWithOut: ['term'],
        method: 'post',
        length: {max: 512}
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }

  deleteAction() {
    const rules = {
      origin_id: {
        string: true,
        length: {min: 10, max: 12},
        required: true,
        method: 'post'
      },
      tid: {
        int: true,
        required: true,
        method: 'post'
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }
};

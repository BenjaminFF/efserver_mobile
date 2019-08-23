module.exports = class extends think.Logic {
  createAction() {
    const rules = {
      name: {
        string: true,
        required: true,
        method: 'post',
        length: {min: 1, max: 30}
      },
      description: {
        string: true,
        method: 'post',
        length: {max: 255}
      },
      terms: {
        required: true,
        string: true,
        method: 'POST',
        jsonSchema: {
          'type': 'array',
          'minItems': 3,
          'items': {
            'type': 'object',
            'required': ['term', 'definition'],
            'maxProperties': 2,
            'properties': {
              'term': {
                'type': 'string',
                'minLength': 1,
                'maxLength': 32
              },
              'definition': {
                'type': 'string',
                'minLength': 1,
                'maxLength': 512
              }
            }
          }
        }
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }

  shareAction() {
    const rules = {
      authorid: {
        string: true,
        length: {min: 10, max: 12},
        required: true,
        method: 'post'
      },
      origin_id: {
        length: {min: 10, max: 12},
        string: true,
        required: true,
        method: 'post'
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }

  acquireAction() {
    const rules = {
      sid: {
        int: true,
        required: true,
        method: 'get'
      },
      origin_id: {
        length: {min: 10, max: 12},
        string: true,
        required: true,
        method: 'get'
      }
    };

    if (!this.validate(rules)) {
      this.fail(402, '数据格式或者请求方法错误');
      return false;
    }
  }

  // ok了
  updateAction() {
    try {
      const rules = {
        set: {
          required: true,
          string: true,
          method: 'POST',
          jsonSchema: {
            'type': 'object',
            'required': ['origin_id'],
            // "maxProperties": 6,
            'properties': {
              'origin_id': {
                'type': 'string',
                'minLength': 10,
                'maxLength': 12
              },
              'name': {
                'type': 'string',
                'minLength': 1,
                'maxLength': 30
              },
              'description': {
                'type': 'string',
                'minLength': 1,
                'maxLength': 255
              }
            },
            'additionalProperties': false
          }
        }
      };

      if (!this.validate(rules)) {
        this.fail(402, '数据格式或者请求方法错误');
        return false;
      }
    } catch (e) {
      this.fail(401, 'JSON格式不正确');
      return false;
    }
  }

  // ok了
  updateRecordAction() {
    try {
      const rules = {
        set: {
          required: true,
          string: true,
          method: 'POST',
          jsonSchema: {
            'type': 'object',
            'required': ['sid'],
            // "maxProperties": 6,
            'properties': {
              'sid': {
                'type': 'number'
              },
              'spell_comb_learncount': {
                'type': 'number'
              },
              'write_learncount': {
                'type': 'number'
              },
              'stared': {
                'type': 'number',
                'minimum': 0,
                'maximum': 1
              }
            },
            'additionalProperties': false
          }
        }
      };
      if (!this.validate(rules)) {
        this.fail(402, '数据格式或者请求方法错误');
        return false;
      }
    } catch (e) {
      this.fail(401, 'JSON格式不正确');
      return false;
    }
  }

  removeAction() {
    const rules = {
      sid: {
        int: true,
        required: true,
        method: 'post'
      },
      origin_id: {
        length: {min: 10, max: 12},
        string: true,
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

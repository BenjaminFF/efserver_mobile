module.exports = class extends think.Logic {
  addAction() {
    const rules = {
      origin_id: {
        string: true,
        length: { min: 10, max: 12 },
        required: true,
        method: 'post'
      },
      term: {
        string: true,
        required: true,
        method: 'post',
        length: { min: 1, max: 32 }
      },
      definition: {
        string: true,
        required: true,
        method: 'post',
        length: { max: 512 }
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
        length: { min: 1, max: 32 }
      },
      definition: {
        string: true,
        requiredWithOut: ['term'],
        method: 'post',
        length: { max: 512 }
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
        length: { min: 10, max: 12 },
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

  updateRecordsAction() {
    try {
      const rules = {
        termRecord: {
          string: true,
          required: true,
          method: 'post',
          jsonSchema: {
            'type': 'object',
            'required': ['sid'],
            // "maxProperties": 6,
            'properties': {
              'tid': {
                'type': 'number'
              },
              'sid': {
                'type': 'number'
              },
              'spell_comb_learned': {
                'type': 'number',
                'minimum': 0,
                'maximum': 1
              },
              'write_learned': {
                'type': 'number',
                'minimum': 0,
                'maximum': 1
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
    } catch (error) {
      this.fail(401, 'JSON格式不正确');
      return false;
    }
  }
};

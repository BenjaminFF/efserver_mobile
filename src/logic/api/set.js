module.exports = class extends think.Logic {
    createAction() {
        let rules = {
            authorid: {
                string: true,
                length: {min: 10, max: 12},
                required: true,
                method: 'post'
            },
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
                    "type": "array",
                    "minItems": 3,
                    "items": {
                        "type": "object",
                        "required": ["term", "definition"],
                        "maxProperties": 2,
                        "properties": {
                            "term": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 32
                            },
                            "definition": {
                                "type": "string",
                                "minLength": 1,
                                "maxLength": 512
                            },
                        }
                    }
                }
            }
        }

        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }


    shareAction() {
        let rules = {
            authorid: {
                string: true,
                length: {min: 10, max: 12},
                required: true,
                method: 'post'
            },
            uid: {
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
        }

        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }

    acquireAction() {
        let rules = {
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
        }

        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }

    updateAction() {
        let rules = {
            set: {
                required: true,
                string: true,
                method: 'POST',
                jsonSchema: {
                    "type": "object",
                    "required": ["sid"],
                    //"maxProperties": 6,
                    "properties": {
                        "sid": {
                            "type": "number"
                        },
                        "term": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 32
                        },
                        "definition": {
                            "type": "string",
                            "minLength": 1,
                            "maxLength": 512
                        },
                        "spell_comb_learncount":{
                            "type": "number",
                        },
                        "write_learncount":{
                            "type": "number",
                        },
                        "stared":{
                            "type": "number",
                            "minimum":0,
                            "maximum":1

                        }
                    }
                }
            }
        }

        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }
}
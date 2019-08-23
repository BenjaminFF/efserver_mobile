module.exports = class extends think.Logic {
    addAction() {
        let rules = {
            name: {
                string: true,
                required: true,
                method: 'post',
                length: {min: 1, max: 30}
            },
            description: {
                string: true,
                required: true,
                method: 'post',
                length: {min: 0, max: 255}
            }
        }
        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }

    updateAction() {
        let rules = {
            fid: {
                int: true,
                required: true,
                method: 'post'
            },
            name: {
                string: true,
                method: 'post',
                length: {min: 1, max: 30}
            },
            description: {
                string: true,
                method: 'post',
                length: {max: 255}
            },
        }

        let name = this.ctx.post('name');
        let description = this.ctx.post('description');
        let isNameEmpty = (typeof name == 'string') && name.length == 0;   //validate的bug，name有两种情况，要么为undefined，要么长度不能为0
        let notValidated = name === undefined && description === undefined;
        if (!this.validate(rules) || isNameEmpty || notValidated) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }

    addSetAction(){
        let rules = {
            fid: {
                int: true,
                required: true,
                method: 'post'
            },
            sid: {
                int: true,
                required: true,
                method: 'post'
            }
        }

        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }

    listSetAction(){
        let rules = {
            fid: {
                int: true,
                required: true,
                method: 'get'
            }
        }

        if (!this.validate(rules)) {
            this.fail(402, '数据格式或者请求方法错误');
            return false;
        }
    }

}

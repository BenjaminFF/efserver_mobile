const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true});

module.exports = {
    rules: {
        jsonSchema(value, {argName, validName, validValue, parsedValidValue, rule, rules, currentQuery, ctx}) {
            let validate = ajv.compile(validValue); // 运行时编译
            let parsedValue=JSON.parse(value);
            let valid = validate(parsedValue);
            if (valid) return true;
            return false;
        },
    }
}
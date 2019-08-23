module.exports = class extends think.Model {
  beforeUpdate(data) {
    for (const key in data) {
      // 如果值为空则不更新
      if (data[key] === undefined) {
        delete data[key];
      }
    }
    return data;
  }
};

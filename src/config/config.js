// default config
module.exports = {
  workers: 1,
  redis: {
    host: '127.0.0.1',
    port: 6379,
    password: ''
  },
  cookie: {
    domain: '',
    path: '/',
    maxAge: 15 * 3600 * 1000 *20, // 10个小时
    signed: false,
    httpOnly: true,
    keys: ['uid'] // 当 signed 为 true 时，使用 keygrip 库加密时的密钥
  }
};

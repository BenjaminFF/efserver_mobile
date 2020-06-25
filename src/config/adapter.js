const redisCache = require('think-cache-redis');
const nunjucks = require('think-view-nunjucks');
const mysql = require('think-model-mysql');
const { Console, File, DateFile } = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';

/**
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'redis',
  common: {
    timeout: 24 * 60 * 60 * 1000 * 20 // millisecond
  },
  redis: {
    handle: redisCache,
    port: 6379,
    host: '127.0.0.1',
    password: ''
  }
};

/**
 * model adapter config
 * @type {Object}
 */
exports.model = {
  type: 'mysql',
  common: {
    logConnect: isDev,
    logSql: isDev,
    logger: msg => think.logger.info(msg)
  },
  mysql: {
    handle: mysql,
    database: 'ewordfun',
    prefix: '',
    encoding: 'utf8mb4',
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'Abc95599.',
    charset: "utf8mb4",
    dateStrings: true,
    connectionLimit: 10 // 连接池的连接个数，默认为 1
  }
};

/**
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'redis',
  redis: {
    handle: redisCache,
    port: 6379,
    host: '127.0.0.1',
    password: ''
  },
  common: {
    cookie: {
      name: 'thinkjs',
      signed: true,
      httpOnly: true,
      timeout: 24 * 60 * 60 * 1000 * 20 // millisecond
    }
  }
};

/**
 * view adapter config
 * @type {Object}
 */
exports.view = {
  type: 'nunjucks',
  common: {
    viewPath: path.join(think.ROOT_PATH, 'view'),
    sep: '_',
    extname: '.html'
  },
  nunjucks: {
    handle: nunjucks
  }
};

/**
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};

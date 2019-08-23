/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
// errno:
// 401 session not valid

module.exports = options => {
  return async(ctx, next) => {
    const validUrls = ['/api/user/login', '/api/user/add', '/api/user/sendPWChangeMail', '/api/user/updatePassword', '/']; // 不需要验证登录的url
    if (!validUrls.includes(ctx.url) && !ctx.url.includes('/resetPassword')) {
      const sessionValidated = await validateSession(ctx); // 以后再加个ip验证和登陆次数限制
      if (sessionValidated) {
        return next();
      } else {
        ctx.fail(405, '没有权限');
        return false;
      }
    } else {
      return next();
    }
  };
};

async function validateSession(ctx) {
  const uid = await ctx.cookie('uid');
  if (typeof uid != 'string' || uid.length == 0) {
    return false;
  }
  const session_userInfo = await ctx.session(uid);
  const userInfo = await ctx.cache(uid, undefined, 'redis');

  if (userInfo == session_userInfo) {
    return true;
  } else {
    return false;
  }
}

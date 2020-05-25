/* eslint-disable eqeqeq */
/* eslint-disable camelcase */
// errno:
// 401 session not valid

module.exports = options => {
  return async (ctx, next) => {
    console.log(Date.now())
    const noNeedValidUrls = ['/api/user/login', '/api/user/add', '/api/user/sendPWChangeMail', '/api/user/updatePassword']; // 不需要验证登录的url
    const sessionValidated = await validateSession(ctx)

    if (ctx.url.includes('/api/validate')) {
      sessionValidated ? ctx.success('验证成功') : ctx.fail(405, '没有权限')
      return false
    }

    if (noNeedValidUrls.includes(ctx.url) || sessionValidated) {
      return next()
    }

    ctx.fail(405, '没有权限')
    return false
  }
}

// 以后再加个ip验证和登陆次数限制
async function validateSession(ctx) {
  const uid = await ctx.cookie('uid')
  if (typeof uid != 'string' || uid.length == 0) return false

  const m_userInfo = await ctx.cache(uid, undefined, 'redis')
  const userInfo = await ctx.cookie(uid)

  return userInfo == m_userInfo
}

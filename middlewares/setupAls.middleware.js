const authService = require('../api/auth/auth.service')
const asyncLocalStorage = require('../services/als.service')

async function setupAsyncLocalStorage(req, res, next) {
  console.log('cookies', req.cookies)
  const storage = {}
  asyncLocalStorage.run(storage, () => {
    if (!req.cookies) return next()
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    console.log('from ALS', loggedinUser);
    if (loggedinUser) {
      const alsStore = asyncLocalStorage.getStore()
      alsStore.loggedinUser = loggedinUser
    }
    next()
  })
}

module.exports = setupAsyncLocalStorage


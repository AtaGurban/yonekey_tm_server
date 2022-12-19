const Router = require('express')
const router = new Router()
const streamRouter = require('./streamRouter')
const userRouter = require('./userRouter.js')
const adminRouter = require('./adminRouter')
const bannerRouter = require('./bannerRouter')
const mainPageRouter = require('./MainPageRouter')




   
router.use('/video', streamRouter) 
router.use('/user', userRouter) 
router.use('/banner', bannerRouter) 
router.use('/admin', adminRouter) 
router.use('/main-page', mainPageRouter) 





module.exports = router 
const Router = require('express')
const router = new Router()
const streamRouter = require('./streamRouter')
const userRouter = require('./userRouter.js')
const adminRouter = require('./adminRouter')
const bannerRouter = require('./bannerRouter')




   
router.use('/video', streamRouter) 
router.use('/user', userRouter) 
router.use('/banner', bannerRouter) 
router.use('/admin', adminRouter) 





module.exports = router 
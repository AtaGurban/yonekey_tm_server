const Router = require('express')
const AdminControllers = require('../controllers/AdminControllers')
const router = new Router()




// router.post('/create-course',authMiddleware, AdminControllers.createCourse)
// router.put('/update-course',authMiddleware, AdminControllers.updateCourse)
router.put('/update-video', AdminControllers.updateVideo)
router.post('/create-video', AdminControllers.createVideo)
router.post('/business', AdminControllers.createBusiness)
router.get('/business', AdminControllers.getBusiness)
router.put('/business', AdminControllers.updateBusiness)
router.post('/business-click', AdminControllers.businessClick)
router.delete('/business', AdminControllers.deleteBusiness)
// router.post('/buy-course',authMiddleware, AdminControllers.buyCourse)
router.get('/getvideo', AdminControllers.getAllVideo)
// router.get('/get-all-course', AdminControllers.getAll)
// router.get('/get-favourite-course', AdminControllers.getFavouriteCourse)
router.get('/get-users', AdminControllers.getAllUsers)
// router.delete('/remove-course', AdminControllers.deleteCourse)
router.delete('/remove-video', AdminControllers.deleteVideo)
router.post('/banner', AdminControllers.createBanner)
router.get('/banner', AdminControllers.getBanner)
// router.put('/banner', AdminControllers.updateBanner)
router.delete('/banner', AdminControllers.deleteBanner)





module.exports = router
const Router = require('express')
const AdminControllers = require('../controllers/AdminControllers')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')



router.post('/create-course',authMiddleware, AdminControllers.createCourse)
router.put('/update-course',authMiddleware, AdminControllers.updateCourse)
router.put('/update-video',authMiddleware, AdminControllers.updateVideo)
router.post('/create-video',authMiddleware, AdminControllers.createVideo)
router.post('/buy-course',authMiddleware, AdminControllers.buyCourse)
router.get('/getvideo', AdminControllers.getAllVideo)
router.get('/get-all-course', AdminControllers.getAll)
router.get('/get-favourite-course', AdminControllers.getFavouriteCourse)
router.get('/get-users', AdminControllers.getAllUsers)
router.delete('/remove-course', AdminControllers.deleteCourse)
router.delete('/remove-video', AdminControllers.deleteVideo)
router.post('/banner', AdminControllers.createBanner)
router.get('/banner', AdminControllers.getBanner)
// router.put('/banner', AdminControllers.updateBanner)
router.delete('/banner', AdminControllers.deleteBanner)





module.exports = router
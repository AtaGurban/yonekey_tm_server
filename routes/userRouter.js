const Router = require('express')
const UserControllers = require('../controllers/UserControllers')
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware')



router.get('/auth', authMiddleware, UserControllers.check)
router.post('/registration',  UserControllers.registration)
router.post('/login',  UserControllers.login)
router.put('/update', authMiddleware, UserControllers.update)
router.delete('/remove', authMiddleware, UserControllers.remove)
router.get('/my-courses', authMiddleware,  UserControllers.myCourse)
router.get('/get-user', authMiddleware,  UserControllers.getOneUser)
router.get('/transaction', authMiddleware,  UserControllers.getAllTransaction)
router.delete('/transaction', authMiddleware,  UserControllers.deleteTransaction)
// router.post('/upload', StreamControllers.add) 
// router.get('/list', StreamControllers.list) 
// router.delete('/remove', StreamControllers.remove) 




module.exports = router
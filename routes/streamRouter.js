const Router = require('express')
const StreamControllers = require('../controllers/StreamControllers')
const router = new Router()



router.get('/', StreamControllers.stream)
// router.post('/upload', StreamControllers.add) 
router.get('/list', StreamControllers.list) 
// router.delete('/remove', StreamControllers.remove) 




module.exports = router
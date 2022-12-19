const Router = require('express')
const MainPageControllers = require('../controllers/MainPageControllers')
const router = new Router()

router.get('/slider-all', MainPageControllers.getAllSlider)
router.get('/slider', MainPageControllers.getSlider)
router.post('/slider', MainPageControllers.createSlider)
router.put('/slider', MainPageControllers.updateSlider)
router.delete('/slider', MainPageControllers.deleteSlider)

module.exports = router
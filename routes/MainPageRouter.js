const Router = require('express')
const MainPageControllers = require('../controllers/MainPageControllers')
const router = new Router()

router.get('/slider-all', MainPageControllers.getAllSlider)
router.get('/slider', MainPageControllers.getSlider)
router.post('/slider', MainPageControllers.createSlider)
router.post('/title-category', MainPageControllers.createTitleCategory)
router.get('/title-category', MainPageControllers.getTitleCategory)
router.put('/title-category', MainPageControllers.updateTitleCategory)
router.delete('/title-category', MainPageControllers.deleteTitleCategory)
router.put('/slider', MainPageControllers.updateSlider)
router.delete('/slider', MainPageControllers.deleteSlider)

module.exports = router 
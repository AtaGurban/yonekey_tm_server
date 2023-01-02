const Router = require('express')
const MainPageControllers = require('../controllers/MainPageControllers')
const router = new Router()

router.get('/slider-all', MainPageControllers.getAllSlider)
router.get('/slider', MainPageControllers.getSlider)
router.post('/slider', MainPageControllers.createSlider)
router.post('/category', MainPageControllers.createCategory)
router.post('/category/click', MainPageControllers.clickCategory)
router.get('/category', MainPageControllers.getCategory)
router.delete('/category', MainPageControllers.deleteCategory)
router.put('/category', MainPageControllers.updateCategory)
router.post('/sub-category', MainPageControllers.createSubCategory)
router.post('/sub-category/click', MainPageControllers.clickSubCategory)
router.get('/sub-category', MainPageControllers.getSubCategory)
router.delete('/sub-category', MainPageControllers.deleteSubCategory)
router.put('/sub-category', MainPageControllers.updateSubCategory) 
router.post('/title-sub-category', MainPageControllers.createTitleSubCategory)
router.get('/title-sub-category', MainPageControllers.getTitleSubCategory)
router.put('/title-sub-category', MainPageControllers.updateTitleSubCategory)
router.delete('/title-sub-category', MainPageControllers.deleteTitleSubCategory)
router.post('/title-category', MainPageControllers.createTitleCategory)
router.get('/title-category', MainPageControllers.getTitleCategory)
router.put('/title-category', MainPageControllers.updateTitleCategory)
router.delete('/title-category', MainPageControllers.deleteTitleCategory)
router.put('/slider', MainPageControllers.updateSlider)
router.delete('/slider', MainPageControllers.deleteSlider)
router.post('/mobile-ads', MainPageControllers.createMobileAds)
router.get('/mobile-ads', MainPageControllers.getMobileAds)
router.get('/mobile-ads/get', MainPageControllers.getMobileAdsAll)
router.get('/search', MainPageControllers.search)
router.delete('/mobile-ads', MainPageControllers.deleteMobileAds)
router.post('/notification', MainPageControllers.createNotification)
router.get('/notification', MainPageControllers.getNotification)
router.put('/notification', MainPageControllers.updateNotification)
router.delete('/notification', MainPageControllers.deleteNotification)
router.post('/ebay', MainPageControllers.createEbay)
router.get('/ebay', MainPageControllers.getEbay)
router.put('/ebay', MainPageControllers.updateEbay)
router.delete('/ebay', MainPageControllers.deleteEbay)

module.exports = router 
const Router = require('express')
const EducationControllers = require('../controllers/EducationControllers')
const router = new Router()



router.get('/city', EducationControllers.getAllCity)
router.get('/collage', EducationControllers.getAllCollage)
router.get('/direction', EducationControllers.getAllDirection)
router.post('/city', EducationControllers.createCity)
router.post('/collage', EducationControllers.createCollage)
router.post('/direction', EducationControllers.createDirection)
router.put('/city', EducationControllers.updateCity)
router.put('/collage', EducationControllers.updateCollage)
router.put('/direction', EducationControllers.updateDirection)
router.delete('/city', EducationControllers.removeCity) 
router.delete('/collage', EducationControllers.removeCollage)
router.delete('/direction', EducationControllers.removeDirection)






module.exports = router
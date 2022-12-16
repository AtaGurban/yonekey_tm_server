const Router = require('express')
const BannerControllers = require('../controllers/BannerControllers')
const router = new Router()

router.get('/', BannerControllers.getBanner)

module.exports = router
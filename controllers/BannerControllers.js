const ApiError = require("../error/ApiError");
const { Banner } = require("../models/models");

class BannerController {
    async getBanner(req, res, next){
   
        const {page} = req.query;
       
        if (!page){
            return next(ApiError.badRequest('Maglumatlarynyz nadogry'))
        }
        const pageItem = await Banner.findOne({where:{page}})
        console.log(pageItem);
        if (!pageItem){ 
            return next(ApiError.badRequest('Sahypa tapylmady'))
        }
        return res.json(pageItem)
    }
}

module.exports = new BannerController()
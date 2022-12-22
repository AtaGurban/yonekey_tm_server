const ApiError = require("../error/ApiError");
const { SliderForMainPage, ImgForSlider, TitleCategory } = require("../models/models");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");

class MainPageController {
  async getAllSlider(req, res, next) {
    try {
      const sliders = await SliderForMainPage.findAll({
        include: { model: ImgForSlider, as: "img" },
      });
      return res.json(sliders);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getSlider(req, res, next) {
    try {
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getTitleCategory(req, res, next) {
    try {
      const titleCategoryAll = await TitleCategory.findAll()
      return res.json(titleCategoryAll)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateTitleCategory(req, res, next) {
    try {
      const {id, number, name} = req.body
      if (!id){
        return next(ApiError.internal('error'));
      }
      let update = {number, name}
      const updatedTitleCategory = await TitleCategory.update(update, {where:{id}})
      return res.json(updatedTitleCategory)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteTitleCategory(req, res, next) {
    try {
      const {id} = req.query
      if (!id){
        return next(ApiError.internal('error'));
      }
      const titleCategory = await TitleCategory.findOne({where:{id}})
      if (titleCategory){
        titleCategory.destroy()
      }
      return res.json(titleCategory)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createTitleCategory(req, res, next) {
    try {
      const {number, name} = req.body
      if (!name || !number){
        return next(ApiError.internal('error'));
      }
      const oldTitleCategory = await TitleCategory.findOne({where:{number}})
      if (oldTitleCategory){
        oldTitleCategory.destroy()
      }
      const titleCategory = await TitleCategory.create({
        name, number
      })
      return res.json(titleCategory)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createSlider(req, res, next) {
    try {
      const { number, countFiles } = req.body;
      if (!number || !countFiles) {
        return next(ApiError.internal("Maglumatlar doly däl"));
      }
      const oldSlider = await SliderForMainPage.findOne({ where: { number } });
      if (oldSlider) {
        const oldImages = await ImgForSlider.findAll({
          where: { sliderForMainPageId: oldSlider.id },
        });
        oldImages.map(async (i) => {
          fs.unlink(
            path.resolve(__dirname, "..", "files", "images", i.img),
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          await i.destroy();
        });
        await oldSlider.destroy();
      }
      const slider = await SliderForMainPage.create({
        number,
      });
      for (let i = 0; i < countFiles; i++) {
        const file = req.files[`file[${i}]`];
        let fileName = uuid.v4() + `.jpg`;
        file.mv(path.resolve(__dirname, "..", "files", "images", fileName));
        await ImgForSlider.create({
          img: fileName,
          sliderForMainPageId: slider.id,
        });
      }
      return res.json(slider);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateSlider(req, res, next) {
    try {
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteSlider(req, res, next) {
    try {
        const {id} = req.query
        const slider = await SliderForMainPage.findOne({where:{id}})
        if (slider){
          console.log(slider);
          const oldImages = await ImgForSlider.findAll({
            where: { sliderForMainPageId: slider.id },
          });
          oldImages.map(async (i) => {
            fs.unlink(
              path.resolve(__dirname, "..", "files", "images", i.img),
              function (err) {
                if (err) {
                  console.log(err);
                }
              }
            );
            await i.destroy();
          });
          await slider.destroy()
            
        }
        return res.json(true)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
}

module.exports = new MainPageController();

const ApiError = require("../error/ApiError");
const { SliderForMainPage, ImgForSlider } = require("../models/models");
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
  async createSlider(req, res, next) {
    try {
      const { number, link, countFiles } = req.body;
      if (!number || !link || !countFiles) {
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
        link,
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
            slider.destroy()
        }
        return res.json(true)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
}

module.exports = new MainPageController();

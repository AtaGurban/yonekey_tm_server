const ApiError = require("../error/ApiError");
const {
  SliderForMainPage,
  ImgForSlider,
  TitleCategory,
  TitleSubCategory,
  Category,
  SubCategory,
  MobileAds,
  Business,
  Notification,
  MyEbay,
} = require("../models/models");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");
const { Op } = require("sequelize");

const deleteTitleCategoryFunc = async (id) => {
  try {
    const titleCategory = await TitleCategory.findOne({
      where: { id },
      include: { model: Category, as: "category" },
    });
    if (titleCategory) {
      titleCategory?.category.map(async (i) => {
        await deleteCategoryFunc(i.id);
      });
      await titleCategory.destroy();
    }
    return titleCategory;
  } catch (error) {
    return error;
  }
};

const deleteCategoryFunc = async (id) => {
  try {
    const category = await Category.findOne({
      where: { id },
      include: { model: TitleSubCategory, as: "title_sub_category" },
    });
    if (category) {
      category?.title_sub_category.map(async (i) => {
        await deleteTitleSubCategoryFunc(i.id);
      });
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", category.img),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      category.destroy();
    }
    return category;
  } catch (error) {
    return error;
  }
};

const deleteTitleSubCategoryFunc = async (id) => {
  try {
    const titleSubCategory = await TitleSubCategory.findOne({
      where: { id },
      include: { model: SubCategory, as: "sub_category" },
    });
    if (titleSubCategory) {
      titleSubCategory?.sub_category.map(async (i) => {
        await deleteSubCategoryFunc(i.id);
      });
      titleSubCategory.destroy();
    }
    return titleSubCategory;
  } catch (error) {
    return error;
  }
};

const deleteSubCategoryFunc = async (id) => {
  try {
    const subCategory = await SubCategory.findOne({ where: { id } });
    if (subCategory) {
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", subCategory.img),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      subCategory.destroy();
    }
    return subCategory;
  } catch (error) {
    return error;
  }
};

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
  async updateCategory(req, res, next) {
    try {
      const { name, link, withLink, titleCategoryId, id } = req.body;
      const img = req?.files?.img;
      if (!name || !titleCategoryId || !id) {
        return next(ApiError.internal("Maglumatlar doly dal"));
      }
      const category = await Category.findOne({ where: { id } });
      if (!category) {
        return next(ApiError.internal("Munun yaly yok"));
      }
      let update = { name, titleCategoryId, link, withLink };
      if (img) {
        const fileNameImg = uuid.v4() + ".jpg";
        await img.mv(
          path.resolve(__dirname, "..", "files", "images", fileNameImg)
        );
        update.img = fileNameImg;
        fs.unlink(
          path.resolve(__dirname, "..", "files", "images", category.img),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
      await Category.update(update, { where: { id } });
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateSubCategory(req, res, next) {
    try {
      const { name, link, id } = req.body;
      const img = req?.files?.img;
      if (!name || !id || !link) {
        return next(ApiError.internal("Maglumatlar doly dal"));
      }
      const subCategory = await SubCategory.findOne({ where: { id } });
      if (!subCategory) {
        return next(ApiError.internal("Munun yaly yok"));
      }
      let update = { name, link };
      if (img) {
        const fileNameImg = uuid.v4() + ".jpg";
        await img.mv(
          path.resolve(__dirname, "..", "files", "images", fileNameImg)
        );
        update.img = fileNameImg;
        fs.unlink(
          path.resolve(__dirname, "..", "files", "images", subCategory.img),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
      }
      await SubCategory.update(update, { where: { id } });
      return res.json(true);
    } catch (error) {
      console.log(error);
      return next(ApiError.internal(error));
    }
  }
  async getTitleCategory(req, res, next) {
    try {
      const { category } = req.query;
      if (category) {
        const titleCategoryAll = await TitleCategory.findAll({
          include: { model: Category, as: "category" },
        });
        return res.json(titleCategoryAll);
      } else {
        const titleCategoryAll = await TitleCategory.findAll();
        return res.json(titleCategoryAll);
      }
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getTitleSubCategory(req, res, next) {
    try {
      const { subCategory, id } = req.query;
      if (subCategory) {
        const titleCategoryAll = await TitleSubCategory.findAll({
          include: { model: SubCategory, as: "sub_category" },
        });
        return res.json(titleCategoryAll);
      } else if (id){
        const titleSubCategoryAll = await TitleSubCategory.findAll({
          where:{categoryId:id}, include: { model: SubCategory, as: "sub_category" },
        })
        return res.json(titleSubCategoryAll);
      }  else {
        const titleCategoryAll = await TitleSubCategory.findAll();
        return res.json(titleCategoryAll);
      }
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateTitleCategory(req, res, next) {
    try {
      const { id, number, name } = req.body;
      if (!id) {
        return next(ApiError.internal("error"));
      }
      let update = { number, name };
      const updatedTitleCategory = await TitleCategory.update(update, {
        where: { id },
      });
      return res.json(updatedTitleCategory);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateTitleSubCategory(req, res, next) {
    try {
      const { id, number, name, categoryId} = req.body;
      if (!id) {
        return next(ApiError.internal("error"));
      }
      let update = { number, name, categoryId };
      const updatedTitleCategory = await TitleSubCategory.update(update, {
        where: { id },
      });
      return res.json(updatedTitleCategory);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteTitleSubCategory(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.internal("error"));
      }
      const result = await deleteTitleSubCategoryFunc(id);
      return res.json(result);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteTitleCategory(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.internal("error"));
      }
      const result = await deleteTitleCategoryFunc(id);
      return res.json(result);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createTitleCategory(req, res, next) {
    try {
      const { number, name } = req.body;
      if (!name || !number) {
        return next(ApiError.internal("error"));
      }
      const oldTitleCategory = await TitleCategory.findOne({
        where: { number },
      });
      if (oldTitleCategory) {
        await deleteTitleCategoryFunc(oldTitleCategory.id)
      }
      const titleCategory = await TitleCategory.create({
        name,
        number,
      });
      return res.json(titleCategory);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createTitleSubCategory(req, res, next) {
    try {
      const { number, name, categoryId } = req.body;
      if (!name || !number || !categoryId) {
        return next(ApiError.internal("error"));
      }
      const oldTitleCategory = await TitleSubCategory.findOne({
        where: { number },
      });
      if (oldTitleCategory) {
        await deleteTitleSubCategoryFunc(oldTitleCategory.id)
      }
      const titleCategory = await TitleSubCategory.create({
        name,
        number,
        categoryId,
      });
      return res.json(titleCategory);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createCategory(req, res, next) {
    try {
      const { name, link, withLink, titleCategoryId } = req.body;
      const img = req?.files?.img;
      if (!name || !titleCategoryId || !img) {
        return next(ApiError.internal("error"));
      }
      const fileNameImg = uuid.v4() + ".jpg";
      await img.mv(
        path.resolve(__dirname, "..", "files", "images", fileNameImg)
      );
      const category = await Category.create({
        name,
        titleCategoryId,
        link,
        withLink,
        img: fileNameImg,
      });
      return res.json(category);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async clickCategory(req, res, next) {
    try {
      const {id} = req.body
      if (id){
        const category = await Category.findOne({where:{id}})
        if (!category){
          return next(ApiError.internal('error'));
        }
        let update = {counter: category.counter + 1}
        await Category.update(update, {where: {id}})
      }
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async clickSubCategory(req, res, next) {
    try {
      const {id} = req.body
      if (id){
        const subCategory = await SubCategory.findOne({where:{id}})
        if (!subCategory){
          return next(ApiError.internal('error'));
        }
        let update = {counter: subCategory.counter + 1}
        await SubCategory.update(update, {where: {id}})
      }
      return res.json(true);
    } catch (error) {
      console.log(error);
      return next(ApiError.internal(error));
    }
  }
  async createSubCategory(req, res, next) {
    try {
      const { name, link, titleSubCategoryId } = req.body;
      const img = req?.files?.img;
      if (!name || !titleSubCategoryId || !img || !link) {
        return next(ApiError.internal("error"));
      }
      const fileNameImg = uuid.v4() + ".jpg";
      await img.mv(
        path.resolve(__dirname, "..", "files", "images", fileNameImg)
      );
      const subCategory = await SubCategory.create({
        name,
        titleSubCategoryId,
        link,
        img: fileNameImg,
      });
      return res.json(subCategory);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getCategory(req, res, next) {
    try {
      const categorys = await Category.findAll();
      return res.json(categorys);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getSubCategory(req, res, next) {
    try {
      const subCategorys = await SubCategory.findAll();
      return res.json(subCategorys);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.internal("error"));
      }
      const result = await deleteCategoryFunc(id);
      return res.json(result);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteSubCategory(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.internal("error"));
      }
      const result = await deleteSubCategoryFunc(id);
      return res.json(result);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createSlider(req, res, next) {
    try {
      const { number, countFiles, text, link } = req.body;
      if (!number || !countFiles) {
        return next(ApiError.internal("Maglumatlar doly däl"));
      }
      const oldSlider = await SliderForMainPage.findOne({ where: { number } });
      if (oldSlider) {
        const oldImages = await ImgForSlider.findAll({
          where: { sliderForMainPageId: oldSlider.id },
        });
        for (let i = 0; i < oldImages.length; i++) {
          const element = oldImages[i];
          fs.unlink(
            path.resolve(__dirname, "..", "files", "images", element.webImg),
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          ); 
          fs.unlink(
            path.resolve(__dirname, "..", "files", "images", element.mobileImg),
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          await element.destroy();
        }
        await oldSlider.destroy();
      }
      const slider = await SliderForMainPage.create({
        number, text, link
      });
      for (let i = 0; i < countFiles; i++) {
        const webFile = req.files[`fileWeb[${i}]`];
        const mobileFile = req.files[`fileMobile[${i}]`];
        let webFileName = uuid.v4() + `.jpg`;
        let mobileFileName = uuid.v4() + `.jpg`;
        await webFile.mv(
          path.resolve(__dirname, "..", "files", "images", webFileName)
        );
        await mobileFile.mv(
          path.resolve(__dirname, "..", "files", "images", mobileFileName)
        );
        await ImgForSlider.create({
          webImg: webFileName,
          mobileImg: mobileFileName,
          sliderForMainPageId: slider.id,
        });
      }
      return res.json(slider);
    } catch (error) {
      console.log(error);
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
      const { id } = req.query;
      const slider = await SliderForMainPage.findOne({ where: { id } });
      if (slider) {
        const oldImages = await ImgForSlider.findAll({
          where: { sliderForMainPageId: slider.id },
        });
        oldImages.map(async (i) => {
          fs.unlink(
            path.resolve(__dirname, "..", "files", "images", i.webImg),
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          fs.unlink(
            path.resolve(__dirname, "..", "files", "images", i.mobileImg),
            function (err) {
              if (err) {
                console.log(err);
              }
            }
          );
          await i.destroy();
        });
        await slider.destroy();
      }
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createMobileAds(req, res, next) {
    try {
      const { name, link } = req.body;
      const img = req.files?.img
      if (!name || !link || !img){
        return next(ApiError.internal('error'));
      }
      let mobileImg = uuid.v4() + `.jpg`;
      await img.mv(
        path.resolve(__dirname, "..", "files", "images", mobileImg)
      );
      const mobileAds = await MobileAds.create({
        name, link, mobileImg
      })  
      return res.json(mobileAds);
    } catch (error) {
      console.log(error);
      return next(ApiError.internal(error));
    }
  }
  async getMobileAds(req, res, next) {
    try {
      const allMobileAds = await MobileAds.findAll()
      const randomAds = Math.ceil(Math.random() * allMobileAds.length) - 1
      return res.json(allMobileAds[randomAds]);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getMobileAdsAll(req, res, next) {
    try {
      const allMobileAds = await MobileAds.findAll()
      return res.json(allMobileAds);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async search(req, res, next) {
    try {
      const {query} = req.query
      const category = await Category.findAll({where: { name: { [Op.like]: `%${query}%` } }})
      const subCategory = await SubCategory.findAll({where: { name: { [Op.like]: `%${query}%` } }})
      const business = await Business.findAll({where: { name: { [Op.like]: `%${query}%` } }})
      return res.json({category, subCategory, business});
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteMobileAds(req, res, next) {
    try {
      const { id } = req.query;
      const mobileAds = await MobileAds.findOne({ where: { id } });
      if (mobileAds) {
        fs.unlink(
          path.resolve(__dirname, "..", "files", "images", mobileAds?.mobileImg),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        await mobileAds.destroy();
      }
      return res.json(mobileAds);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteNotification(req, res, next) {
    try {
      const { id } = req.query;
      const notification = await Notification.findOne({ where: { id } });
      if (notification) {
        fs.unlink(
          path.resolve(__dirname, "..", "files", "images", notification?.mobileImg),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        await notification.destroy();
      }
      return res.json(notification);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createNotification(req, res, next) {
    try {
      const { title, date, type } = req.body;
      const img = req.files?.img
      if (!title || !date || !type || !img){
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      let mobileImg = uuid.v4() + `.jpg`;
      await img.mv(
        path.resolve(__dirname, "..", "files", "images", mobileImg)
      );
      const notification = await Notification.create({
        mobileImg, title, date, type
      })
      return res.json(notification);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getNotification(req, res, next) {
    try {
      const notificationAll = await Notification.findAll()
      return res.json(notificationAll);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateNotification(req, res, next) {
    try {
      const { id, title, type } = req.body;
      if (!title || !type || !id){
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      const notification = await Notification.findOne({ where: { id } });
      if (!notification) {
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      await Notification.update({title, type}, {where: {id}})
      return res.json(notification);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteEbay(req, res, next) {
    try {
      const { id } = req.query;
      const ebay = await MyEbay.findOne({ where: { id } });
      if (ebay) {
        await ebay.destroy();
      }
      return res.json(ebay);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createEbay(req, res, next) {
    try {
      const { title, link, description } = req.body;
      if (!title || !link ){
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      const ebay = await MyEbay.create({
        title, link, description
      })
      return res.json(ebay);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async getEbay(req, res, next) {
    try {
      const ebayAll = await MyEbay.findAll()
      return res.json(ebayAll);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateEbay(req, res, next) {
    try {
      const { id, title, link, description } = req.body;
      if (!title || !link  || !id){
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      const ebay = await MyEbay.findOne({ where: { id } });
      if (!ebay) {
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      await MyEbay.update({title, link, description}, {where: {id}})
      return res.json(ebay);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
}

module.exports = new MainPageController();

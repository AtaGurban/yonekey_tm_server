const { Course, Video, User, File, Banner, Business } = require("../models/models");
const fs = require("fs");
const ApiError = require("../error/ApiError");
const uuid = require("uuid");
const path = require("path");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const { resolve } = require("path");
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

class AdminController {
  async createVideo(req, res, next) {
    try {
      const { name, countFiles, author } = req.body;
      const { img, video } = req.files;
      const fileNameVideo = uuid.v4() + ".mp4";
      const fileNameVideoPath = "720" + fileNameVideo;
      video.mv(
        path.resolve(
          __dirname,
          "..",
          "files",
          "ConvertedVideo",
          fileNameVideoPath
        )
      );
      const videoNameCheck = await Video.findOne({ where: { name } });
      if (videoNameCheck) {
        return next(ApiError.internal("Munun yaly wideo onem goyuldy"));
      }

      let fileNameImg = uuid.v4() + ".jpg";
      if (img) {
        img.mv(path.resolve(__dirname, "..", "files", "images", fileNameImg));
      } else {
        ffmpeg(
          path.resolve(
            __dirname,
            "..",
            "files",
            "ConvertedVideo",
            fileNameVideoPath
          )
        ).screenshot({
          timemarks: [ '50%' ],
          filename: fileNameImg,
          folder: path.resolve(__dirname, "..", "files", "images"),
        }).on('error', function(e) {
          console.log('Screenshots taken', e);
          return next(ApiError.internal(e));
        });
      }
      const result = await Video.create({
        name,
        author,
        video: fileNameVideo,
        img: fileNameImg, 
      });
 
      for (let i = 0; i < countFiles; i++) {
        const file = req.files[`file[${i}]`];
        const fileType = file.name.split(".")[1]; 
        let fileName = uuid.v4() + `.${fileType}`;
        file.mv(path.resolve(__dirname, "..", "files", "files", fileName));
        await File.create({
          name: file.name,
          file: fileName,
          videoId: result.id,
        });
      }
      return res.json(result);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }

  async getAllVideo(req, res, next) {
    const { id } = req.query;
    const list = await Video.findAll({ where: { courseId: id } });
    return res.json(list);
  }
  async getAllUsers(req, res, next) {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({ offset, limit });
    // users.rows = users.rows.slice((page - 1 ) * limit, page * limit)
    return res.json(users);
  } 
  async createBanner(req, res, next) {
    const { page } = req.body;
    const banner = req?.files?.banner;
    if (banner) {
      const bannerCheck = await Banner.findOne({ where: { page}});
      if (bannerCheck) {
        fs.unlink(
          path.resolve(__dirname, "..", "files", "images", bannerCheck.img),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        bannerCheck.destroy();
      }
      const fileNameImg = uuid.v4() + ".gif";
      banner.mv(path.resolve(__dirname, "..", "files", "images", fileNameImg));
      const bannerCreate = await Banner.create({
        page,
        img: fileNameImg,
      });
      return res.json(bannerCreate);
    }
  }
  async getBanner(req, res, next) {
    const banners = await Banner.findAll();
    // users.rows = users.rows.slice((page - 1 ) * limit, page * limit)
    return res.json(banners);
  }
  async getBusiness(req, res, next) {
    try {
      const business = await Business.findAll();
      return res.json(business);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async businessClick(req, res, next) {
    try {
      const {id} = req.body
      if (id){
        const business = await Business.findOne({where:{id}})
        if (!business){
          return next(ApiError.internal('error'));
        }
        let update = {counter: business.counter + 1}
        await Business.update(update, {where: {id}})
      }
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async deleteBusiness(req, res, next) {
    try {
      const {id} = req.query
      const business = await Business.findOne({where:{id}});
      if (!business){
        return next(ApiError.internal('error'));
      }
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", business.img),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      business.destroy()
      return res.json(business);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async updateBusiness(req, res, next) {
    try {
      const {name, link, id} = req.body;
      const img = req.files?.img
      if (!id){
        return next(ApiError.internal('error'));
      }
      const business = await Business.findOne({where:{id}})
      if (!business){
        return next(ApiError.internal('Biznes tapylmady'));
      }
      let update = {}
      if (name){
        update.name = name
      }
      if (link){
        update.link = link
      }
      if (img){
        fs.unlink(
          path.resolve(__dirname, "..", "files", "images", business.img),
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        const fileNameImg = uuid.v4() + ".jpg";
        img.mv(path.resolve(__dirname, "..", "files", "images", fileNameImg));
        update.img = fileNameImg
      }
      await Business.update(update, { where: { id } });
      return res.json(true);
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }
  async createBusiness(req, res, next) {
    try {
      const {name, link} = req.body;
      const img = req.files?.img
      if (!name || !link || !img){
        return next(ApiError.internal('Maglumatlar doly dal'));
      }
      const checkBusiness = await Business.findOne({where:{name}})
      if (checkBusiness){
        return next(ApiError.internal('Munun yaly biznes onem bar'));
      }
      const fileNameImg = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "files", "images", fileNameImg));
      const business = await Business.create({
        name, link, img: fileNameImg
      })
      return res.json(business)
    } catch (error) {
      return next(ApiError.internal(error));
    }
  }

  // async updateBanner(req, res, next) {
  //   const page = req.query.page || 1;
  //   const limit = 10;
  //   const offset = (page - 1) * limit;
  //   const users = await User.findAndCountAll({ offset, limit });
  //   // users.rows = users.rows.slice((page - 1 ) * limit, page * limit)
  //   return res.json(users);
  // }
  async deleteBanner(req, res, next) {
    const { id } = req.query;
    const banner = await Banner.findOne({ id });
    if (banner) {
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", banner.img),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      banner.destroy();
    }
    return res.json(banner);
  }

  async updateVideo(req, res, next) {
    const { videoName, id, countFiles } = req.body;
    const img = req?.files?.img;
    const video = await Video.findOne({ where: { id } });
    let update = {
      name: videoName,
    };

    if (img) {
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", video.img),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      const fileNameImg = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "files", "images", fileNameImg));
      update.img = fileNameImg;
    }
    await Video.update(update, { where: { id } });

    try {
      for (let i = 0; i < countFiles; i++) {
        const file = req.files[`file[${i}]`];
        const fileType = file.name.split(".")[1];
        let fileName = uuid.v4() + `.${fileType}`;
        file.mv(path.resolve(__dirname, "..", "files", "files", fileName));
        await File.create({
          name: JSON.stringify(file.name),
          file: fileName,
          videoId: id,
        });
      }
      return res.json(true);
    } catch (error) {
      return res.json(error);
    }
  }

  async deleteVideo(req, res, next) {
    const { id } = req.query;
    const course = await Video.findOne({ where: { id } });
    const fileItems = await File.findAll({
      where: { videoId: id },
    });
    fileItems.map(async (i) => {
      fs.unlink(
        path.resolve(__dirname, "..", "files", "files", i.file),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      await File.destroy({ where: { id: i.id } });
    });
    fs.unlink(
      path.resolve(__dirname, "..", "files", "images", course.img),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    fs.unlink(
      path.resolve(
        __dirname,
        "..",
        "files",
        "ConvertedVideo",
        `720${course.video}`
      ),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    fs.unlink(
      path.resolve(
        __dirname,
        "..",
        "files",
        "ConvertedVideo",
        `480${course.video}`
      ),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    fs.unlink(
      path.resolve(
        __dirname,
        "..",
        "files",
        "ConvertedVideo",
        `360${course.video}`
      ),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    course.destroy();
    return res.json(course);
  }
}

module.exports = new AdminController();

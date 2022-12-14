const { Course, Video, User, File, Banner } = require("../models/models");
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
  async createCourse(req, res, next) {
    try {
      const { name, description, favourite, teacher } = req.body;
      const { imgFile } = req.files;
      if (!name || !description || !favourite || !teacher || !imgFile) {
        return next(ApiError.internal("Maglumatlar doly dal"));
      }
      const teacherdata = await User.findOne({
        where: { phone: teacher, thisTeacher: true },
      });
      if (!teacherdata) {
        return next(ApiError.internal("Munun yaly mugallym yok"));
      }
      const checkCourse = await Course.findOne({ where: { name } });
      if (checkCourse) {
        return next(ApiError.internal("Munun yaly kurs onem bar"));
      }
      let img = uuid.v4() + ".jpg";

      imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));

      const course = await Course.create({
        name,
        img,
        description,
        favourite,
        userId: teacherdata.id,
      });

      return res.json(course);
    } catch (error) {
      next(ApiError.internal(error.message));
    }
  }
  async createVideo(req, res, next) {
    try {
      const { name, countFiles } = req.body;
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

  async getAll(req, res) {
    const list = await Course.findAll();
    return res.json(list);
  }

  async getFavouriteCourse(req, res) {
    const list = await Course.findAll({ where: { favourite: true } });
    return res.json(list);
  }
  async getAllVideo(req, res) {
    const { id } = req.query;
    const list = await Video.findAll({ where: { courseId: id } });
    return res.json(list);
  }
  async getAllUsers(req, res) {
    const page = req.query.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;
    const users = await User.findAndCountAll({ offset, limit });
    // users.rows = users.rows.slice((page - 1 ) * limit, page * limit)
    return res.json(users);
  }
  async createBanner(req, res) {
    const img = req?.files?.img;
    if (img) {
      const bannerCheck = await Banner.findOne({ where: { page: "main" } });
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
      img.mv(path.resolve(__dirname, "..", "files", "images", fileNameImg));
      const banner = await Banner.create({
        page: "main",
        img: fileNameImg,
      });
      return res.json(banner);
    }
  }
  async getBanner(req, res) {
    const banners = await Banner.findAll();
    // users.rows = users.rows.slice((page - 1 ) * limit, page * limit)
    return res.json(banners);
  }
  // async updateBanner(req, res) {
  //   const page = req.query.page || 1;
  //   const limit = 10;
  //   const offset = (page - 1) * limit;
  //   const users = await User.findAndCountAll({ offset, limit });
  //   // users.rows = users.rows.slice((page - 1 ) * limit, page * limit)
  //   return res.json(users);
  // }
  async deleteBanner(req, res) {
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

  async buyCourse(req, res, next) {
    const { number, userId } = req.body;
    const course = await Course.findOne({ where: { id: number } });
    const user = await User.findOne({ where: { id: userId } });
    if (!user || !course) {
      return next(ApiError.internal("Girizilen maglumatlar yalnys"));
    }
    const checkTransaction = await Transaction.findOne({
      where: { userId, courseId: number },
    });
    if (checkTransaction) {
      return next(ApiError.internal("Bu ulanyjyda bu kurs onem bar"));
    }
    const transaction = await Transaction.create({
      userId,
      courseId: number,
    });
    return res.json(transaction);
  }
  async updateCourse(req, res) {
    const { courseName, description, favCourse, id } = req.body;
    const img = req?.files?.img;
    const course = await Course.findOne({ where: { id } });
    let update = {
      name: courseName,
      description,
      favourite: favCourse,
    };
    if (img) {
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", course.img),
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
    await Course.update(update, { where: { id } });

    return res.json(true);
  }

  async updateVideo(req, res) {
    const { videoName, number, id } = req.body;
    const img = req?.files?.img;
    const video = await Video.findOne({ where: { id } });
    let update = {
      name: videoName,
      number,
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

    return res.json(true);
  }

  async deleteCourse(req, res) {
    const { id } = req.query;
    const course = await Course.findOne({ where: { id } });
    const courseWideos = await Video.findAll({ where: { courseId: id } });
    courseWideos.map((i) => {
      fs.unlink(
        path.resolve(__dirname, "..", "files", "images", i.img),
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
          `720${i.video}`
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
          `480${i.video}`
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
          `360${i.video}`
        ),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      i.destroy();
    });
    fs.unlink(
      path.resolve(__dirname, "..", "files", "images", course.img),
      function (err) {
        if (err) {
          console.log(err);
        }
      }
    );
    course.destroy();
    const transactionsItems = await Transaction.findAll({
      where: { courseId: null },
    });
    transactionsItems.map(async (i) => {
      await Transaction.destroy({ where: { id: i.id } });
    });
    return res.json(course);
  }
  async deleteVideo(req, res) {
    const { id } = req.query;
    const course = await Video.findOne({ where: { id } });

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

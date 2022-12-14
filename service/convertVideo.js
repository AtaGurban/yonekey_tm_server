const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const { resolve } = require("path");
const { VideoMediumQuality, VideoLowQuality } = require("../models/models");
ffmpeg.setFfmpegPath(ffmpegPath);

const convertVideo = async (size, videoBitrate, fileNameVideo, id) => {
  return new Promise((resolve, reject) => {
    const pathConvertVideo = path.resolve(
      __dirname,
      "..",
      "files",
      "ConvertedVideo",
      `720${fileNameVideo}`
    );
    let quality = size.split("x")[1];
    ffmpeg(pathConvertVideo)
      .size(size)
      .audioBitrate(96)
      .videoBitrate(videoBitrate)
      .renice(20)
      .save(
        path.resolve(
          __dirname,
          "..",
          "files",
          "ConvertedVideo",
          `${quality}` + fileNameVideo
        )
      )
      .on('error', (err)=> { 
        console.log('an error happened: ' + err.message);
        return reject(new Error(err))
      })
      .on('end', () => {
        console.log('FFmpeg done!')
        if (quality === '480'){
            VideoMediumQuality.create({
                thisConverted: true,
                mediumId: id
            })
        }else if (quality === '360'){
            VideoLowQuality.create({
                thisConverted: true,
                lowId: id
            })
        }
        resolve()
      })
  });
};

module.exports = {
  convertVideo,
};

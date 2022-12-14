const ApiError = require("../error/ApiError");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");

const { Course, Video, User } = require("../models/models");

class StreamControllers {
  async stream(req, res, next) {
    try {
      const { id, q } = req.query;
        const video = await Video.findOne({ where: { id: id } });
        const videoName = `${q}${video.video}`;
        // Ensure there is a range given for the video
        const range = req.headers.range;
        if (!range) {
          res.status(400).send("Requires Range header");
        }
        console.log(range);
        const videoPath = path.resolve(
          __dirname,
          "..",
          "files",
          "ConvertedVideo",
          videoName
        );
        const fileSize = fs.statSync(videoPath).size;
        const parts = range.replace(/bytes=/, '').split('-')
        const CHUNK_SIZE = 10 ** 6 / 10;
        const start = parseInt(parts[0], 10)
        const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
        // const chunksize = (end - start) + 1
        const stream = fs.createReadStream(videoPath, { start, end })
        console.log(end);
        res.writeHead(206, {
          'Content-Type': 'video/mp4',
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': CHUNK_SIZE,
      })

      stream.pipe(res)
    } catch (error) {
      return res.json(error);
    }
  }

  async list(req, res, next) {
    const page = req.query.page || 1;
    const limit = 25;
    const offset = (page - 1) * limit;
    const videos = await Video.findAndCountAll({ offset, limit })
    return res.json(videos);
  }
} 

module.exports = new StreamControllers();

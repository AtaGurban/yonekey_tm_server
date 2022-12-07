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
        const videoSize = fs.statSync(videoPath).size;
        const CHUNK_SIZE = 10 ** 6 / 10; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    
        // Create headers
        const contentLength = end - start + 1;
        const headers = {
          "Content-Range": `bytes ${start}-${end}/${videoSize}`,
          "Accept-Ranges": "bytes", 
          "Content-Length": contentLength, 
          "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
    
        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });
    
        // Stream the video chunk to the client
        videoStream.pipe(res);
    } catch (error) {
        return res.json(error)
    }


  }

  async list(req, res, next) {
    const { id, videoId } = req.query;
    if (id) {
      const course = await Course.findOne({ where: { id: id }, include:{model:Video, as:'video'} });
      return res.json(course);
    } 
    if (videoId){
        const video = await Video.findOne({where:{id:videoId}, include:{model: Course, as: 'course'}})
        const nextVideoId = (await Video.findOne({where:{courseId:video.course.id, number: video.number + 1}}))?.id
        const teacher = await User.findOne({where:{id:video.course.userId}})
        return res.json({video, nextVideoId, teacher});
    }
  }

}

module.exports = new StreamControllers();

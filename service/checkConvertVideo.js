const { Video, VideoLowQuality, VideoMediumQuality } = require("../models/models");
const { convertVideo } = require("./convertVideo");

const checkConvertVideo = async()=>{
    const videos = await Video.findAll({include:[{model: VideoLowQuality, as: 'low'}, {model: VideoMediumQuality, as: 'medium'}]})
    for (let i = 0; i < videos.length; i++) {
        const element = videos[i];
        if (!element.low){
            await convertVideo("640x360", 250, element.video, element.id)
            
        }
        if (!element.medium){
            await convertVideo("854x480", 400, element.video, element.id)
             
        }
    }

}

module.exports = {
    checkConvertVideo
} 
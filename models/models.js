const sequelize = require("../db");
const { DataTypes } = require("sequelize");


const Video = sequelize.define("video", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: DataTypes.STRING, defaultValue: null },
  author: { type: DataTypes.STRING, defaultValue: null },
  video: { type: DataTypes.STRING, defaultValue: null },
  img: { type: DataTypes.STRING, defaultValue: null },
});
const VideoMediumQuality = sequelize.define("video-medium-quality", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  thisConverted: { type: DataTypes.BOOLEAN, defaultValue: false },
});
const VideoLowQuality = sequelize.define("video-low-quality", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true, 
    allowNull: false,
  },
  thisConverted: { type: DataTypes.BOOLEAN, defaultValue: false },
});
const File = sequelize.define("file", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // number: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, defaultValue: null },
  file: { type: DataTypes.STRING, defaultValue: null },
});

const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,},
    avatar: { type: DataTypes.STRING, defaultValue: null },
    email: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false, unique:true },
    password: { type: DataTypes.STRING, allowNull: false },
    first_name: { type: DataTypes.STRING, defaultValue: null },
    last_name: { type: DataTypes.STRING, defaultValue: null },
    description: { type: DataTypes.STRING, defaultValue: null },
    thisTeacher: { type: DataTypes.BOOLEAN, defaultValue: false },
    role: {type: DataTypes.STRING, defaultValue: 'USER'}
  }
);

 

const Business = sequelize.define("business", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  link: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Banner = sequelize.define("banner", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  page: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

Video.hasMany(File, { as: "file" });
 
Video.hasOne(VideoLowQuality, { as: "low" });

Video.hasOne(VideoMediumQuality, { as: "medium" });
 

module.exports = {
  Banner,
  User,
  Video,
  File,
  VideoLowQuality,
  VideoMediumQuality,
  Business 
}
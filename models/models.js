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
  name: { type: DataTypes.STRING, defaultValue: null },
  file: { type: DataTypes.STRING, defaultValue: null },
});
const Category = sequelize.define("category", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  counter: { type: DataTypes.INTEGER, defaultValue: 0 },
  name: { type: DataTypes.STRING, defaultValue: null },
  link: { type: DataTypes.STRING, defaultValue: null }, 
  img: { type: DataTypes.STRING, defaultValue: null }, 
  withLink: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const TitleCategory = sequelize.define("title_category", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  number: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, defaultValue: null },
});

const TitleSubCategory = sequelize.define("title_sub_category", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  number: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, defaultValue: null },
});

const SubCategory = sequelize.define("sub_category", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true, 
    autoIncrement: true,
    allowNull: false,
  },
  counter: { type: DataTypes.INTEGER, defaultValue: 0 },
  name: { type: DataTypes.STRING, defaultValue: null },
  img: { type: DataTypes.STRING, defaultValue: null }, 
  link: { type: DataTypes.STRING, defaultValue: null },
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
  counter: {type: DataTypes.BIGINT, defaultValue: 0}
});

const SliderForMainPage = sequelize.define("slider-for-main-page", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },  
  // text: { type: DataTypes.STRING, defaultValue: null },
  // link: { type: DataTypes.STRING, allowNull: false },
  number: { type: DataTypes.INTEGER, allowNull: false },
}); 

const MobileAds = sequelize.define("mobile-ads", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: DataTypes.STRING, defaultValue: null },
  link: { type: DataTypes.STRING, defaultValue: null },
  mobileImg: { type: DataTypes.STRING, defaultValue: null },
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

const ImgForSlider = sequelize.define("img-for-slider", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  webImg: { type: DataTypes.STRING, allowNull: false },
  mobileImg: { type: DataTypes.STRING, allowNull: false },
});

SliderForMainPage.hasMany(ImgForSlider, {as: 'img'})

Video.hasMany(File, { as: "file" });

TitleCategory.hasMany(Category, { as: "category" });

Category.hasMany(TitleSubCategory, { as: "title_sub_category" });

TitleSubCategory.hasMany(SubCategory, { as: "sub_category" });
 
Video.hasOne(VideoLowQuality, { as: "low" });

Video.hasOne(VideoMediumQuality, { as: "medium" });
 

module.exports = {
  Banner,
  User,
  Video,
  File,
  SubCategory,
  TitleCategory,
  TitleSubCategory,
  MobileAds,
  Category,
  VideoLowQuality,
  VideoMediumQuality,
  Business,
  SliderForMainPage,
  ImgForSlider 
}
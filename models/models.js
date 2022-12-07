const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Course = sequelize.define("course", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: { type: DataTypes.STRING, defaultValue: null, unique:true },
  description: { type: DataTypes.STRING, defaultValue: null },
  // teacher: { type: DataTypes.STRING, defaultValue: false },
  img: { type: DataTypes.STRING, defaultValue: null },
  favourite: { type: DataTypes.BOOLEAN, defaultValue: true },
});

const Video = sequelize.define("video", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  number: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, defaultValue: null },
  video: { type: DataTypes.STRING, defaultValue: null },
  img: { type: DataTypes.STRING, defaultValue: null },

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

const Transaction = sequelize.define(
  "transaction",
  {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,},
  }
);  

const City = sequelize.define("city", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  price: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, defaultValue: null },
});
 
const Collage = sequelize.define("collage", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  price: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, defaultValue: null },
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

const Direction = sequelize.define("direction", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  price: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, defaultValue: null },
});


const Category = sequelize.define("category", {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});


City.hasOne(Category)
Category.belongsTo(City) 

Collage.hasOne(Category)
Category.belongsTo(Collage) 

Direction.hasOne(Category)
Category.belongsTo(Direction) 
  
Course.hasMany(Transaction, )
Transaction.belongsTo(Course, {as: 'course'}) 

User.hasMany(Transaction, ) 
Transaction.belongsTo(User, {as: 'user'}) 

User.hasMany(Course, {as: 'teacher'})

Course.hasMany(Video, { as: "video" });
Video.belongsTo(Course, {as: 'course'});

City.hasMany(Collage, { as: "collage" });
Collage.belongsTo(City, {as: 'city'});

Collage.hasMany(Direction, { as: "direction" });
Direction.belongsTo(Collage, {as: 'collage'});


module.exports = {
  Course,
  Banner,
  User,
  Video,
  Transaction,
  Direction,
  City,
  Collage,
  Category
}
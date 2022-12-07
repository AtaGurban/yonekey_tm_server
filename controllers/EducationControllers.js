const ApiError = require("../error/ApiError");
const fs = require("fs");
const uuid = require("uuid");
const path = require("path");

const removeImg = async (img)=>{
    fs.unlink(
        path.resolve(__dirname, "..", "files", "images", img),
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
}
const { Course, Video, User, City, Collage, Direction, Category } = require("../models/models");

class EducationControllers {

  async getAllCity(req, res, next) {
    const cityes = await City.findAll()
    return res.json(cityes)
  }
  async removeCity(req, res, next) {
    const {id} = req.query
    const city = await City.findOne({where:{id}})
    await removeImg(city.img)
    await city.destroy()
    const collages = await Collage.findAll({where:{cityId:null}})
    collages.map(async (i)=>{
        await removeImg(i.img)
        await i.destroy()
    })
    const directions = await Direction.findAll({where:{collageId:null}})
    directions.map(async (i)=>{
        await removeImg(i.img)
        await i.destroy()
    })
    return res.json(city)
  }
  async createCity(req, res, next) {
    const {name, price} = req.body
    const {imgFile} = req.files
    let img = uuid.v4() + ".jpg";
    imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));
    const city = await City.create({
        img, price, name
    })
    const cityId = city.id
    const catId = await Category.create({cityId})
    return res.json(city)
  }
  async updateCity(req, res, next) {
    const {name, price, id} = req.body
    const imgFile = req.files?.imgFile
    const city = await City.findOne({where:{id}})
    let update = {price, name}
    if (imgFile){
      await removeImg(city.img)
      let img = uuid.v4() + ".jpg";
      imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));
      update.img = img
    }
    await City.update(update, {where:{id}})
    return res.json(city)
  }
  async getAllCollage(req, res, next) {
    const cityId = req.query.id
    const collages = await Collage.findAll({where:{cityId}})
    return res.json(collages)
  }
  async removeCollage(req, res, next) {
    const {id} = req.query
    const collage = await Collage.findOne({where:{id}})
    await removeImg(collage.img)
    await collage.destroy()
    const directions = await Direction.findAll({where:{collageId:null}})
    directions.map(async (i)=>{
        await removeImg(i.img)
        await i.destroy()
    })
    return res.json(collage)
  }
  async createCollage(req, res, next) {
    const {name, price, cityId} = req.body
    const {imgFile} = req.files
    let img = uuid.v4() + ".jpg";
    imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));
    const collage = await Collage.create({
        img, price, name, cityId:(+cityId)
    })
    const collageId = collage.id
    const catId = await Category.create({collageId})
    return res.json(collage)
  }
  async updateCollage(req, res, next) {
    const {name, price, id, cityId} = req.body
    const imgFile = req.files?.imgFile
    const collage = await Collage.findOne({where:{id}})
    let update = {price, name, cityId}
    if (imgFile){
      await removeImg(collage.img)
      let img = uuid.v4() + ".jpg";
      imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));
      update.img = img
    }
    await Collage.update(update, {where:{id}})
    return res.json(collage)
  }
  async getAllDirection(req, res, next) {
    const collageId = req.query.id
    const directions = await Direction.findAll({where:{collageId}})
    return res.json(directions)
  }
  async removeDirection(req, res, next) {
    const {id} = req.query
    const direction = await Direction.findOne({where:{id}})
    await removeImg(direction.img)
    await direction.destroy()
    return res.json(direction)
  }
  async createDirection(req, res, next) {
    const {name, price, collageId} = req.body
    const {imgFile} = req.files
    let img = uuid.v4() + ".jpg";
    imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));
    const direction = await Direction.create({
        img, price, name, collageId:(+collageId)
    })
    const directionId = direction.id
    const catId = await Category.create({directionId})
    return res.json(direction)
  }
  async updateDirection(req, res, next) {
    const {name, price, id, collageId} = req.body
    const imgFile = req.files?.imgFile
    const direction = await Direction.findOne({where:{id}})
    let update = {price, name, collageId}
    if (imgFile){
      await removeImg(direction.img)
      let img = uuid.v4() + ".jpg";
      imgFile.mv(path.resolve(__dirname, "..", "files", "images", img));
      update.img = img
    }
    await Direction.update(update, {where:{id}})
    return res.json(direction) 
  }

}

module.exports = new EducationControllers();

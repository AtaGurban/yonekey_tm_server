const ApiError = require("../error/ApiError")
var FormData = require('form-data');
const bcrypt = require('bcrypt')
const {User, Transaction, Course} = require('../models/models')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const path = require("path");
const { sendData } = require("../service/CRMSendData")

const generateJwt = (id, email, name, role, phone)=>{
 return jwt.sign({id, email:email, name:name, phone:phone, role:role}, process.env.SECRET_KEY, {expiresIn: '25d'})
}

class UserController {
    async registration(req, res, next){
   
        const {email, name, password, phone, role, forCRM} = req.body;
       
        if (!email || !password || !name || !phone){
            return next(ApiError.badRequest('Maglumatlarynyz nadogry'))
        }
        const candidate = await User.findOne({where:{email}})
        const candidateTwo = await User.findOne({where:{phone}})
        if (candidate || candidateTwo){ 
            return next(ApiError.badRequest('Bu telefon on hasaba alyndy'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, first_name:name, role, phone, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.name, user.role, user.phone)
        if (forCRM == true){
            const dataForCRM = new FormData();
            dataForCRM.append("csrf_token_name", '524a2176533bb4bd9cbcaf9b04accfd2');
            dataForCRM.append("key", '218d83799b99f55a89892c6fd9d12130');
            dataForCRM.append("name", `${name}`);
            dataForCRM.append("email", `${email}`);
            dataForCRM.append("phonenumber", `${phone}`);
            const data = await sendData(dataForCRM)
            console.log(data);
        }
        return res.json({token})
    }
    async createUser(req, res, next){
   
        const {email, name, password, phone, role} = req.body;
       
        if (!email || !password || !name || !phone){
            return next(ApiError.badRequest('Maglumatlarynyz nadogry'))
        }
        const candidate = await User.findOne({where:{email}})
        const candidateTwo = await User.findOne({where:{phone}})
        if (candidate || candidateTwo){ 
            return next(ApiError.badRequest('Bu telefon on hasaba alyndy'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, first_name:name, role, phone, password: hashPassword})
        const token = generateJwt(user.id, user.email, user.name, user.role, user.phone)
        return res.json({token})
    }
    async login(req, res, next){
        const {phone, password} = req.body;
        const user = await User.findOne({where:{phone}})
        if (!user){ 
            return next(ApiError.internal('Munun yaly ulanyjy yok'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if(!comparePassword){
            return next(ApiError.internal('Acarsoz yalnys'))
        }
        const token = generateJwt (user.id, user.email, user.name, user.role)
        return res.json({token})
    }
    async check(req, res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.name, req.user.role)
        return res.json({token}) 
    }
    async myCourse(req, res, next){
        const {userId} = req.query
        const courses = await Transaction.findAll({where:{userId}, include:{model:Course, as:'course'}})
        return res.json(courses) 
    }
    async getAllTransaction(req, res, next){
        const page = req.query.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        const courses = await Transaction.findAndCountAll({include:[{model:Course, as:'course'}, {model:User, as:'user'}], offset, limit})
        return res.json(courses) 
    }
    async deleteTransaction(req, res, next){
        const {id} = req.query;
        const transaction = await Transaction.findOne({where:{id}})
        await transaction.destroy()
        return res.json(transaction) 
    }
    async getOneUser(req, res, next){
        const {id} = req.query
        const user = await User.findOne({where:{id}})
        return res.json(user) 
    }
    async remove(req, res, next){
        const {id} = req.query
        const user = await User.findOne({where:{id}})
        user.destroy()
        return res.json(user) 
    }
    async update(req, res, next){
        const {id, userPassword, role, userName} = req.body
        let update = {first_name: userName, role}
        if (userPassword){
            const hashPassword = await bcrypt.hash(userPassword, 5)
            update.password = hashPassword
        }
        const user = await User.update(update, {where:{id}})
        return res.json(user)  
    }
}

module.exports = new UserController()
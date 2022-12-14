require("dotenv").config();
const fs = require("fs");
const http = require("http"); 
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const bcrypt = require('bcrypt')
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const { checkConvertVideo } = require("./service/checkConvertVideo");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/static", express.static(path.resolve(__dirname, "files", "images")));
app.use("/api/static", express.static(path.resolve(__dirname, "files", "convertedVideo")));
app.use(express.static(path.join(__dirname, "build")));
app.use(fileUpload({})); 
app.use("/api", router); 
app.use(ErrorHandlingMiddleware);
 
const start = async () => {
  const httpServer = http.createServer(app);
  // const httpsServer = https.createServer(credentials, app);  
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    httpServer.listen(PORT, () => console.log(`server started on port ${PORT}`));
    const checkAdmin = await models.User.count()
    if (checkAdmin === 0){
      const email = 'admin@gmail.com'
      const phone = '+99364328721' 
      const password = 'superAdmin123'
      const first_name = 'SuperAdmin'
      const role = 'SUPERADMIN'
      const hashPassword = await bcrypt.hash(password, 5)
      const user = await models.User.create({email, first_name, role, phone, password: hashPassword})
    }
    await checkConvertVideo()
    app.get('*', async (req, res) =>{
      res.sendFile(path.join(__dirname, "build", 'index.html'))
    })
    // httpsServer.listen(443, () => console.log(`server started on port 443`)); 
    // app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
  } catch (error) {
    console.log(error);
  }
}; 

start();

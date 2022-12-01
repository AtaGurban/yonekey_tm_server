require("dotenv").config();
const fs = require("fs");
const http = require("http"); 
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const fileUpload = require("express-fileupload");
const router = require("./routes/index");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/static", express.static(path.resolve(__dirname, "files", "images")));
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
    // httpsServer.listen(443, () => console.log(`server started on port 443`)); 
    // app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))
  } catch (error) {
    console.log(error);
  }
}; 

start();



// app.get("/", function (req, res) {
//   res.sendFile(__dirname + "/index.html");
// });
// let id = 0
// app.get("/video", function (req, res) {



//   // get video stats (about 61MB)


//   // Parse Range
//   // Example: "bytes=32324-"




// console.log('start', start);
// console.log('end', end);
//   // HTTP Status 206 for Partial Content

// });



// app.listen(8000, function () {
//   console.log("Listening on port 8000!");
// });
const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
//middleware
// app.use(express.json());
app.use(cors());
//suggested for formdata 
app.use(bodyParser.json({ limit: "50mb" }))

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

////routes
app.use("/auth", require("./routes/jwtAuth"));

app.use("/dashboard", require("./routes/dashboard"));
let serverPort = 8080;
app.listen(serverPort, ()=>{
    console.log(`Server is running on port ${serverPort}`);
});
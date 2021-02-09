const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
//experimental https
const https = require('https');
const fs = require('fs');
const configs = require('./config');
//
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

//experimental https continued
if(!configs.dev){
    let httpsPort = 8081;
    const httpsServer = https.createServer({
        key: fs.readFileSync('/home/ubuntu/relevant_certs/privkey.pem'),
        cert: fs.readFileSync('/home/ubuntu/relevant_certs/fullchain.pem'),
    },app);
    httpsServer.listen(httpsPort,()=>{
    console.log(`HTTPS Server running on port ${httpsPort}`);
    });
}

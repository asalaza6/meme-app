const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const configs = require('../config');

router.get("/", authorization, async (req, res)=>{
    try {

        const user = await pool.query("SELECT * FROM users WHERE user_id = $1",[
            req.user
        ]);
        res.json(user.rows[0]);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/images", authorization, async (req, res)=>{
    try {

        const images = await pool.query("SELECT image_id,image_type FROM images ORDER BY create_timestamp DESC");
        // console.log(images);
        res.json(images);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/comments", authorization, async (req, res)=>{
    try {

        const comments = await pool.query("SELECT comment_content,create_timestamp FROM comments WHERE image_id = $1 ORDER BY create_timestamp ASC",[
            req.header("image")
        ]);
        
        res.json(comments);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/comments", authorization, async (req, res)=>{
    try {
        //destructure body
        let {image,content} = req.body;
        let user = req.user;
        console.log(req.body);
        //insert new comment
        const newComment = await pool.query(
            "INSERT INTO comments (user_id,comment_content,image_id) VALUES ($1,$2,$3) RETURNING *",
            [user,content,image]);
        res.json(newComment);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/upload",authorization, async (req, res)=>{
    try {
        //destructure body
        let {name, content} = req.body;

        //format string to data and type
        var base64Data = content.replace(/^data:image\//, "");
        var type = base64Data.split(/;/);
        base64Data = type[1].replace(/base64,/,"");
        type = type[0];
        //insert image into table
        const newImage = await pool.query(
            "INSERT INTO images (image_name,image_type) VALUES ($1,$2) RETURNING *",
            [name,type]);
        //save image to server
        let fileName = newImage.rows[0].image_id;
        
        // console.log(type,base64Data.slice(0,100));
        // console.log(configs.images.location);
        require("fs").writeFile(configs.images.location+fileName+"."+type, base64Data, 'base64', function(err) {
            console.log(err);
        });
        //insert image into table
        // console.log(name,type);
        
        

        res.json("image uploaded");
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
module.exports = router;
const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const configs = require('../config');

router.get("/", authorization, async (req, res)=>{
    //console.log(req.user);
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
router.get("/profileimages", authorization, async (req, res)=>{
    try {

        const images = await pool.query("SELECT image_id,image_type FROM images where user_id = $1 ORDER BY create_timestamp DESC",[
            req.user
        ]);
        
        //console.log(images);
        res.json(images);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/comments", authorization, async (req, res)=>{
    try {

        const comments = await pool.query("SELECT comment_content,create_timestamp,comment_id,user_id FROM comments WHERE image_id = $1 ORDER BY create_timestamp  DESC LIMIT $2 OFFSET $3",[
            req.header("image"), 4, req.header("count")
        ]);
        const count = await pool.query("SELECT COUNT(*) FROM comments WHERE image_id = $1 ",[
            req.header("image")
        ]);
        //console.log(comments,count);
        res.json({comments,count});
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/likeimage", authorization, async (req, res)=>{
    try {

        let image = req.header("image");
        let user = req.header("user");
        const like = await pool.query(
            "SELECT FROM likes WHERE user_id = $1 AND image_id = $2",
            [user,image]);
        //console.log(like.rows.length);
        res.json(like.rows.length>0);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/likeimage", authorization, async (req, res)=>{
    try {
        let {image, liked, user} = req.body;
        if(liked){
            //if liked then unlike by deleting entry
            const del = await pool.query(
                "DELETE FROM likes WHERE user_id = $1 AND image_id = $2",
                [user,image]);
        }else{
            //if not liked add entry
            const insert = await pool.query(
                "INSERT INTO likes (user_id,image_id) VALUES ($1,$2) RETURNING *",
                [user,image]);
        }
        //console.log(user,image);
        res.json(!liked);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/deletecomment", authorization, async (req, res)=>{
    try {
        //destructure body
        let {comment} = req.body;
        let user = req.user;
        //console.log(comment,user);
        //insert new comment
        const newComment = await pool.query(
            "DELETE FROM comments WHERE comment_id = $1 AND user_id = $2 RETURNING *",
            [comment,user]);
        //console.log(newComment.rows);
        if(!newComment.rows.length){
            res.status(500).json("User not authorized to delete comment");
        }
        res.json(newComment.rows);
    }catch(err){
        //console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/comments", authorization, async (req, res)=>{
    try {
        //destructure body
        let {image,content} = req.body;
        let user = req.user;
        //console.log(req.body);
        //insert new comment
        const newComment = await pool.query(
            "INSERT INTO comments (user_id,comment_content,image_id) VALUES ($1,$2,$3) RETURNING *",
            [user,content,image]);
        //console.log(newComment.rows);
        res.json(newComment.rows);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/upload",authorization, async (req, res)=>{
    try {
        //destructure body
        //console.log("req", req.user);
        let {name, content} = req.body;

        //format string to data and type
        var base64Data = content.replace(/^data:image\//, "");
        var type = base64Data.split(/;/);
        base64Data = type[1].replace(/base64,/,"");
        type = type[0];
        //insert image into table
        const newImage = await pool.query(
            "INSERT INTO images (image_name,image_type,user_id) VALUES ($1,$2,$3) RETURNING *",
            [name,type,req.user]);
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
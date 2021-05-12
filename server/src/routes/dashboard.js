const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");
const configs = require('../config');

router.get("/", authorization, async (req, res)=>{
    //console.log(req.user);
    try {

        const user = await pool.query("SELECT * FROM users WHERE user_name = $1",[
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
        
        const images = await pool.query("SELECT image_id,image_type FROM images ORDER BY create_timestamp DESC LIMIT $1 OFFSET $2",[
            4, req.header("count")
        ]);
        const count = await pool.query("SELECT COUNT(*) FROM images");
        
        //console.log("images");
        res.json({images,count});
    }catch(err){
        console.log("images",err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/feedimages", authorization, async (req, res)=>{
    try {
        
        const images = await pool.query(`
         SELECT U.image_id, U.user_name, U.image_type
         FROM ((
            SELECT i.image_id,i.user_name,i.image_type, i.create_timestamp
            FROM images i, follows f
            WHERE (i.user_name = f.followee AND f.follower = $1) 
         ) 
         UNION
         ( 
            SELECT i.image_id,i.user_name,i.image_type, i.create_timestamp
            FROM images i
            WHERE i.user_name = $1
         )) as U
         ORDER BY U.create_timestamp DESC
         LIMIT $2 OFFSET $3
        `,[
            req.header("user_name"),4, req.header("count")
        ]);
        const count = await pool.query(`SELECT COUNT(*)
        FROM images i, follows f
        WHERE (i.user_name = f.followee AND f.follower = $1) OR i.user_name = $1`,[
           req.header("user_name")
       ]);
       const more = images.rowCount != 0;
        //console.log(images, images.rowCount);
        res.json({images,more});
    }catch(err){
        console.log("images",err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/popularimages", async (req, res)=>{
    try {
        const images = await pool.query(`
            
            SELECT i.image_id, i.user_name, i.image_type, CL.num_likes
            FROM (SELECT l.image_id, COUNT(*) AS num_likes
                    FROM likes l
                    GROUP BY l.image_id) as CL, images i
            WHERE i.image_id = CL.image_id 
            ORDER BY CL.num_likes DESC
            LIMIT $1 OFFSET $2`,[
                4, req.header("count")
            ]
        );
        const count = await pool.query(`
            SELECT COUNT(DISTINCT l.image_id)
            FROM likes l, images i
            WHERE i.image_id = l.image_id`
        );
        //console.log(images);
        res.json({images,count});
    }catch(err){
        console.log("images",err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/champions", authorization, async (req, res)=>{
    try {
        
        const champions = await pool.query(`
            SELECT L.user_name, COUNT(*) as total_likes
            FROM (SELECT ll.image_id, u.user_name
                FROM likes ll, users u, images ii
                WHERE ll.image_id = ii.image_id AND ii.user_name = u.user_name) as L
            GROUP BY L.user_name
            ORDER BY total_likes DESC
        `
        );
        //console.log(champions);
        res.json(champions);
    }catch(err){
        console.log("images",err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/profileimages", authorization, async (req, res)=>{
    try {
        
        const images = await pool.query("SELECT image_id,user_name,image_type FROM images where user_name = $1 ORDER BY create_timestamp DESC",[
            req.header("name")
        ]);
        //console.log(images);
        //console.log(images);
        res.json(images);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
//get comments
router.get("/comments", async (req, res)=>{
    try {

        const comments = await pool.query("SELECT comment_content,create_timestamp,comment_id,user_name FROM comments WHERE image_id = $1 ORDER BY create_timestamp  DESC LIMIT $2 OFFSET $3",[
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
router.get("/deletepost", authorization, async (req, res)=>{
    try {
        const deletePost = await pool.query(
            "DELETE FROM images WHERE image_id = $1 AND user_name = $2 RETURNING *",
            [req.header("image"),req.header("user")]);
        //console.log(deletePost.rows, deletePost.rows.length);
        if(!deletePost.rows.length){
            console.log("hre")
            throw "User not authorized to delete comment";
        }
        
        //console.log(comments,count);
        res.json(deletePost);
    }catch(err){
        console.log(err.message, err);
        res.status(500).json(err);
    }
});
// router.get("/getname", authorization, async (req, res)=>{
//     try {

//         const user_name = await pool.query("SELECT user_name FROM users WHERE user_id = $1",[
//             req.header("user_id")
//         ])
//         //console.log(comments,count);
//         res.json(user_name);
//     }catch(err){
//         console.log(err.message);
//         res.status(500).json("Server Error");
//     }
// });
router.get("/searchusers", authorization, async (req, res)=>{
    //console.log("searching users", req.header("search"));
    
    try {

        const users = await pool.query(`SELECT user_name FROM users WHERE user_name LIKE '${req.header("search").toLowerCase()}%'`);
        res.json(users.rows);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
//get like status and number of likes on a post
router.get("/likeimage", authorization, async (req, res)=>{
    try {
        let image = req.header("image");
        let user = req.header("user");
        const like = await pool.query(
            "SELECT FROM likes WHERE user_name = $1 AND image_id = $2",
            [user,image]);
        const number_likes = await pool.query("SELECT COUNT(*) FROM likes WHERE image_id = $1 ",[
            image
        ]);
        // console.log(like.rows, user);
        res.json({liked:like.rows.length>0,number_likes:number_likes.rows[0].count});
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});

router.get("/offlinelike", async (req, res)=>{
    try {
        let image = req.header("image");
        const number_likes = await pool.query("SELECT COUNT(*) FROM likes WHERE image_id = $1 ",[
            image
        ]);
        // console.log(like.rows, user);
        res.json({number_likes:number_likes.rows[0].count});
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
//like or unlike a post
router.post("/likeimage", authorization, async (req, res)=>{
    try {
        let {image, liked, user} = req.body;
        if(liked){
            //if liked then unlike by deleting entry
            const del = await pool.query(
                "DELETE FROM likes WHERE user_name = $1 AND image_id = $2",
                [user,image]);
        }else{
            //if not liked add entry
            const insert = await pool.query(
                "INSERT INTO likes (user_name,image_id) VALUES ($1,$2) RETURNING *",
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
            "DELETE FROM comments WHERE comment_id = $1 AND user_name = $2 RETURNING *",
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
// add a new commnt
router.post("/comments", authorization, async (req, res)=>{
    try {
        //destructure body
        let {image,content} = req.body;
        let user = req.user;
        //console.log(req.body);
        //insert new comment

        // console.log(user_name);
        const newComment = await pool.query(
            "INSERT INTO comments (user_name,comment_content,image_id) VALUES ($1,$2,$3) RETURNING *",
            [user,content,image]);
        //console.log(newComment.rows);
        res.json(newComment.rows);
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/follow", authorization, async (req, res)=>{
    try {
        //destructure body
        //user_id belongs to follower and username belongs to followee
        let {state,followee,follower} = req.body;
        
        //console.log(followee_id);
        if(state){//if user already following unfollow
            const unFollow = await pool.query(
                "DELETE FROM follows WHERE followee = $1 AND follower = $2 RETURNING *",
                [followee,follower]);
            console.log(unFollow.rows);
            res.json(unFollow.rows);
        }//otherwise follow
        else{
            const newFollow = await pool.query(
                "INSERT INTO follows (followee,follower) VALUES ($1,$2) RETURNING *",
                [followee,follower]);
                
        
            //console.log(newFollow.rows);
            res.json(newFollow.rows);
        }
        //insert new follow
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
router.get("/follow", authorization, async (req, res)=>{
    try {
        //destruct header
        let followee = req.header("followee");
        let follower = req.header("follower");
        
        
        //check if follower followee exists
        const follow = await pool.query(
            "SELECT * FROM follows WHERE followee = $1 AND follower = $2",
            [followee,follower]);
        //console.log(follow.rows.length);
        //console.log(like.rows.length);
        res.json(follow.rows.length==1);
    }catch(err){
        console.log("get",err.message);
        res.status(500).json("Server Error");
    }
});
router.post("/upload",authorization, async (req, res)=>{
    try {
        //destructure body
        //console.log("req", req.user);
        let {user_name, content, type} = req.body;
        
        //format string to data and type
        var base64Data = content.replace(/^data:image\//, "");
        var fileType = base64Data.split(/;/);
        base64Data = fileType[1].replace(/base64,/,"");
        fileType = fileType[0];
        
        // console.log(type,base64Data.slice(0,100));
        // console.log(configs.images.location);
        if(type=="post"){
            //insert image into table
            const newImage = await pool.query(
                "INSERT INTO images (image_type,user_name) VALUES ($1,$2) RETURNING *",
                [fileType,req.user]);
            //save image to server
            let fileName = newImage.rows[0].image_id;
            require("fs").writeFile(configs.images.postLocation+fileName+"."+fileType, base64Data, 'base64', function(err) {
                console.log(err);
            });
        }else if(type="profile"){
            if(!user_name){
                res.status(500).json(`Username must be included in profile upload`);
            }
            require("fs").writeFile(configs.images.profileLocation+user_name+"."+fileType, base64Data, 'base64', function(err) {
                console.log(err);
            });
        }else{
            res.status(500).json(`Upload type invalid: ${type}`);
        }
        //insert image into table
        // console.log(name,type);
        
        

        res.json("image uploaded");
    }catch(err){
        console.log(err.message);
        res.status(500).json("Server Error");
    }
});
module.exports = router;
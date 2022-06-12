const router = require("express").Router();
import bcrypt from 'bcryptjs';
import { jwtGenerator } from "../utils/jwtGenerator";
import { authorizeMiddleware, validInfoMiddleware } from "../middleware";
import { prisma } from './prisma';
//registering
router.post("/register", validInfoMiddleware, async (req: { body: { name: any; email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): any; new(): any; }; send: { (arg0: string): void; new(): any; }; }; json: (arg0: { token: any; user_name: any; }) => any; }) => {
    try {
        //1. destructure the req.body (name email password)
        var { name, email, password } = req.body;
        name = name.toLowerCase();
        //2. check if user exists (if user exists throw error)
        // const user = await pool.query("SELECT * FROM users WHERE user_email = $1 OR user_name = $2", [
        //     email,name
        // ]);
        const user = await prisma.users.findMany({
            where: {
                OR: [{
                    user_email: email,
                },{
                    user_name: name,
                }],
            },
        });

        if(user.length !== 0){
            return res.status(401).json("Username or email already exists");
        }
        //3. bcrypt the password
        
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password,salt);
        //4. enter the new user inside our database
        // const newUser = await pool.query(
        //     "INSERT INTO users (user_name, user_email,user_password) VALUES ($1, $2, $3) RETURNING *",
        //     [name, email, bcryptPassword]);
        const newUser = await prisma.users.create({
            data: {
                user_name: name, 
                user_email: email,
                user_password: bcryptPassword,
            },
        });
        //5. generating our jwt token
        const user_name = newUser.user_name;
        const token = jwtGenerator(user_name);
        //console.log(req.body);
        return res.json({ token, user_name });

    } catch(err: any) {
        console.log(err.message);
        res.status(500).send("Server Error");
    }
});

// router.post("/login", validInfoMiddleware, async(req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): any; new(): any; }; send: { (arg0: string): void; new(): any; }; }; json: (arg0: { token: any; user_name: any; }) => any; })=>{
//     try{
//         //1. destructure the req.body

//         const { email, password } = req.body;

//         //2. check if user doesn't exist

//         // const user = await pool.query("SELECT * FROM users where user_email = $1",[email]);
//         const user = await prisma.users.findMany({
//             where: {
//                 user_email: email,
//             }
//         })
//         if (user.length === 0) {
//             return res.status(401).json("Password or Email is incorrect");
//         }
//         //check if incoming ppassswod is the same the database password

//         const validPassword = await bcrypt.compare(password,user[0].user_password);
//         if (!validPassword) {
//             return res.status(401).json("Password or Email is incorrect");
//         }
//         //4 
//         const user_name = user[0].user_name;
//         const token = jwtGenerator(user_name);
//         //console.log(token);
//         return res.json({ token, user_name });
//     } catch(err: any){
//         console.log(err.message);
//         res.status(500).send("Server Error");
//     }
// });

// router.post("/changePassword",validInfoMiddleware, async(req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; })=>{
//     try{
//         //not yet implemented
//     }catch(err: any){
//         console.log(err.message);
//         res.status(500).send("Server Error");
//     }
// });

// router.get("/verify",authorizeMiddleware,async (req: any, res: { json: (arg0: boolean) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; })=> {
        
//    // console.log("hello im here in authorization!\n");
//         try {
//             res.json(true);
//         } catch (err: any) {
//             console.error(err.message);
//             res.status(500).send("Server error");
//         }
// });
router.get("/", (req, res) => {
    res.json({
      hello: "jwtauth!"
    });
  });

export default router;
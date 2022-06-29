// pages/api/publish/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { jwtGenerator } from '../../utils/jwtGenerator';

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res:NextApiResponse) {
    //1. destructure the req.body (name email password)
    console.log(req, req.body);
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
    // try {
    //     //1. destructure the req.body (name email password)
    //     console.log(req.body);
    //     var { name, email, password } = req.body;
    //     name = name.toLowerCase();
    //     //2. check if user exists (if user exists throw error)
    //     // const user = await pool.query("SELECT * FROM users WHERE user_email = $1 OR user_name = $2", [
    //     //     email,name
    //     // ]);
    //     const user = await prisma.users.findMany({
    //         where: {
    //             OR: [{
    //                 user_email: email,
    //             },{
    //                 user_name: name,
    //             }],
    //         },
    //     });

    //     if(user.length !== 0){
    //         return res.status(401).json("Username or email already exists");
    //     }
    //     //3. bcrypt the password
        
    //     const saltRound = 10;
    //     const salt = await bcrypt.genSalt(saltRound);

    //     const bcryptPassword = await bcrypt.hash(password,salt);
    //     //4. enter the new user inside our database
    //     // const newUser = await pool.query(
    //     //     "INSERT INTO users (user_name, user_email,user_password) VALUES ($1, $2, $3) RETURNING *",
    //     //     [name, email, bcryptPassword]);
    //     const newUser = await prisma.users.create({
    //         data: {
    //             user_name: name, 
    //             user_email: email,
    //             user_password: bcryptPassword,
    //         },
    //     });
    //     //5. generating our jwt token
    //     const user_name = newUser.user_name;
    //     const token = jwtGenerator(user_name);
    //     //console.log(req.body);
    //     return res.json({ token, user_name });

    // } catch(err: any) {
    //     console.log(err.message);
    //     res.status(500).send("Server Error");
    // }
}

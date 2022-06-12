// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        //1. destructure the req.body

        const { email, password } = req.body;

        //2. check if user doesn't exist

        // const user = await pool.query("SELECT * FROM users where user_email = $1",[email]);
        const user = await prisma.users.findMany({
            where: {
                user_email: email,
            }
        })
        if (user.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }
        //check if incoming ppassswod is the same the database password

        const validPassword = await bcrypt.compare(password,user[0].user_password);
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }
        //4 
        const user_name = user[0].user_name;
        const token = jwtGenerator(user_name);
        //console.log(token);
        return res.json({ token, user_name });
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

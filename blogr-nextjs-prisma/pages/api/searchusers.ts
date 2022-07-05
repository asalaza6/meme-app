// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        //1. destructure the req.body

        const { search } = req.headers;

        //2. check if user doesn't exist

        // const user = await pool.query("SELECT * FROM users where user_email = $1",[email]);
        const users = await prisma.users.findMany({
            select: {
                user_name: true,
                user_image: true,
            },
            where: {
                user_name: {
                    startsWith: search
                },
            }
        })
        return res.json(users);
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

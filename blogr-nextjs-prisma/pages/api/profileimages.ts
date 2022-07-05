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
        const profileImages = await prisma.images.findMany({
            select: {
                image_id: true,
                user_name: true,
                image_type: true,
                url: true,
                users: {
                    select: {
                        user_image: true,
                    }
                }
            },
            where: {
                user_name: req.headers['name'],
            },
            orderBy: {
                create_timestamp: 'desc',
            }
        })
        return res.json({ images: profileImages});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

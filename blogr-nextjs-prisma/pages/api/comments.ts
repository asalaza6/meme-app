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
        const count = await prisma.comments.count({
            where: {
                image_id: req.header('image'),
            }
        })
        // const user = await pool.query("SELECT * FROM users where user_email = $1",[email]);
        const comments = await prisma.comments.findMany({
            select: {
                comment_content: true,
                create_timestamp: true,
                comment_id: true,
                user_name: true,
            },
            where: {
                image_id: req.header('image'),
            },
            orderBy: {
                create_timestamp: 'desc',
            },
            take: 4,
            skip: req.header("count"),
        })
        return res.json({comments,count});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

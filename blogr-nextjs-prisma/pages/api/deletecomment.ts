// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        const { comment: comment_id } = req.body;
        const user_name = req.user_name;
        const newComment = await prisma.comments.delete({
            where: {
                comment_id
            }
        })
        return res.json({newComment});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

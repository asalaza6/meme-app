// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';
import withProtect from '../../middleware/withUser';

// PUT /api/publish/:id
async function handler(req, res) {
    // res.json({ test: 'test '});
    try{
        const { comment: comment_id } = req.body;
        const user_name = req.user_name;
        const currentComment = await prisma.comments.findUnique({
            where: {
                comment_id
            }
        });
        if (currentComment.user_name !== user_name) {
            res.status(500).send('User does not have permission to delete this comment');
        }
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

export default withProtect(handler);
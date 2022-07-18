// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';
import withProtect from '../../middleware/withUser';

// PUT /api/publish/:id
async function handler(req, res) {
    // res.json({ test: 'test '});
    try{
        const { image: image_id } = req.headers;
        const { user_name } = req;
        const currentPost = await prisma.images.findUnique({
            where: {
                image_id
            }
        });
        if (currentPost.user_name !== user_name) {
            res.status(500).send('User does not have permission to delete this post');
        }
        const deletePost = await prisma.images.delete({
            where: {
                image_id,
            }
        });
        if (!deletePost) throw 'User not authorized';
        return res.json(deletePost);
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

export default withProtect(handler);
// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        const { image: image_id } = req.headers;
        const { user_name } = req;
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

// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        const image_id = req.headers['image'];
        const number_likes = await prisma.likes.count({
            where: {
                image_id
            }
        });
        return res.json({ number_likes })
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

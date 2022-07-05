// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';
import { NextApiRequest } from 'next';
import withProtect from '../../middleware/withUser';

// PUT /api/publish/:id
const handler = async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        //1. destructure the req.body
        if (req.method === 'GET') {
            const image_id = req.headers['image'];
            const { user_name } = (req as any);
            const like = await prisma.likes.findUnique({
                where: {
                    image_id_user_name: {image_id, user_name},
                }
            });
            const number_likes = await prisma.likes.count({
                where: {
                    image_id
                }
            })
            return res.json({ liked: like !== null, number_likes })
        } 
        if (req.method === 'POST') {
            const { image: image_id, liked, user: user_name } = req.body;
            if (liked) {
                await prisma.likes.delete({
                    where: {
                        image_id_user_name: {
                            image_id,
                            user_name
                        }
                    }
                });
            } else {
                await prisma.likes.create({
                    data: {
                        image_id,
                        user_name,
                    }
                });
            }
            res.json(!liked);
        }
        return res.status(500).send("Invalid Method!");
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

export default withProtect(handler);

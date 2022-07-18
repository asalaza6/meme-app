// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';
import withProtect from '../../middleware/withUser';

// PUT /api/publish/:id
const handler = async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        if (req.method === 'GET') {
            const comments = await prisma.comments.findMany({
                select: {
                    comment_content: true,
                    create_timestamp: true,
                    comment_id: true,
                    user_name: true,
                    users: {
                        select: {
                            user_image: true,
                        }
                    }
                },
                where: {
                    image_id: req.headers['image'],
                },
                orderBy: {
                    create_timestamp: 'desc',
                },
                take: 4,
                skip: parseInt(req.headers['count'], 10),
            });
            const count = await prisma.comments.count({
                where: {
                    image_id: req.headers['image'],
                }
            })
            return res.json({comments, count});
        }
        if (req.method === 'POST') {
            const {image: image_id, content: comment_content} = req.body;
            const user_name = req.user_name;
            const newComment = await prisma.comments.create({
                data: {
                    comment_content,
                    image_id,
                    user_name,
                }
            });
            return res.json(newComment);
        }
        res.status(500).send("Invalid Method");
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

export default withProtect(handler, ['GET']);
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
        
        const popular = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        user_image: true
                    }
                }
            },
            orderBy: {
                likes: {
                    _count: 'desc'
                }
            },
            take: 4,
            skip: parseInt(req.headers['count'], 10),
        });
        const count = await prisma.images.count();
        return res.json({images: popular, count});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

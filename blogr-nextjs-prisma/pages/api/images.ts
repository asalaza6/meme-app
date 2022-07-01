// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';

// PUT /api/publish/:id
export default async function handle(req, res) {
    try{
        const images = await prisma.images.findMany({
            select: {
              image_id: true,
              image_type: true,
            },
            orderBy: {
                create_timestamp: 'desc',
            },
            take: 4,
            skip: req.header("count")
        })
        // const user = await pool.query("SELECT * FROM users where user_email = $1",[email]);
        const count = prisma.images.count();
        res.json({images,count});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        
        const profilePic = await prisma.users.findUnique({
            select: {
                user_image: true,
            },
            where: {
                user_name: req.headers['name'],
            },
        });
        return res.json({ url: profilePic.user_image });
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

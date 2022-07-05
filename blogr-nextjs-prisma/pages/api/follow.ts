// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        if (req.method === 'POST') {
            const { state, followee, follower } = req.body;
            if (state) { // unfollow
                const unFollow = await prisma.follows.delete({
                    where: {
                        followee_follower: {
                            followee,
                            follower
                        }
                    }
                });
                return res.json(unFollow);
            } else { //follow
                const newFollow = await prisma.follows.create({
                    data: {
                        followee,
                        follower,
                    }
                });
                return res.json(newFollow);
            }
        }
        if (req.method === 'GET') {
            const { followee, follower } = req.headers;
            const follow = await prisma.follows.findUnique({
                where: {
                    followee_follower: {
                        followee,
                        follower,
                    }
                }
            });
            return res.json(follow !== null);
        }
        return res.json({});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

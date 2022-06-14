// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';

// PUT /api/publish/:id
export default async function handle(req, res) {
    // res.json({ test: 'test '});
    try{
        //1. destructure the req.body

        const { user_name, count } = req.header;

        //2. check if user doesn't exist
        const followersReq = await prisma.users.findMany({
            where: {
                user_name
            },
            select: {
                follows_follows_followerTousers: {
                    select: {
                        users_follows_followeeTousers: {
                            select: {
                                user_name
                            }
                        }
                    }
                },
            }
        });
        const followers = followersReq.reduce((reducer, reducerItem) => {
            const { follows_follows_followerTousers } = reducerItem;
            console.log(follows_follows_followerTousers);
            return reducer;
        }, []);
        // const user = await pool.query("SELECT * FROM users where user_email = $1",[email]);
        const feedImages2 = await prisma.images.findMany({
            where: {
                OR: [
                    {
                        user_name: user_name,
                    },
                    {
                        user_name: {
                            in: followers,
                        }
                    },
                ]
            },
            orderBy: {
                create_timestamp: 'desc',
            },
            take: 4,
            skip: count,
        });
        // const count = prisma.images.findMany({})
        const more = feedImages2.length !== 0;
        // const feedImages = await prisma.users.findFirst({
        //     where: {
        //         user_name: user_name,
        //     },
        //     include: {
        //         follows_follows_followerTousers: {
        //            select: {
        //                 users_follows_followerTousers: {
        //                     select: {
        //                         images: {
        //                             select: {
        //                                 image_id: true,
        //                                 image_type: true,
        //                                 create_timestamp: true,
        //                             }
        //                         }
        //                     }
        //                 }
        //            }
        //         },
        //         images: {
        //             select: {
        //                 image_id: true,
        //                 image_type: true,
        //                 create_timestamp: true,
        //             }
        //         },
        //     },
        // })
        return res.json({images: feedImages2, more});
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

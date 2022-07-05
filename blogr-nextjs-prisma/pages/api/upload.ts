// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary'
import withProtect from '../../middleware/withUser';
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

// PUT /api/publish/:id
const handler = async function handle(req, res) {
    // res.json({ test: 'test '});
    let { content, type, folder } = req.body;
    let { user_name } = req;
    if (!(folder === 'posts' || folder === 'profile')) {
        return res.status(500).send( `Invalid folder ${folder}`);
    }
    try{
        const response = await cloudinary.uploader.upload(
            content,
            {
                folder,
            },
            function(error, result) {
                console.log(result, error)
            },
        );
        const {
            secure_url,
            url,
        } = response;
        if (secure_url || url) {
            // image_id === url
            if (folder === 'posts') {
                const image = await prisma.images.create({
                    data: {
                        url: secure_url || url,
                        user_name,
                        image_type: '.notimportantanymore',
                    }
                });
                return res.json({ image, url: secure_url || url });
            }
            if (folder === 'profile') {
                const user = await prisma.users.update({
                    where: {
                        user_name,
                    },
                    data: {
                        user_image: secure_url || url,
                    }
                })
                return res.json({ user, url: secure_url || url });
            }
        } else {
            throw(Error('no secure url found (cloudinary error)!'));
        }
        return res.json({ response });
    } catch(err: any){
        console.log(err.message);
        res.status(500).send("Server Error");
    }
}

export default withProtect(handler);
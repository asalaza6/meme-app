// pages/api/publish/[id].ts

import prisma from '../../lib/prisma';
import { jwtGenerator } from '../../utils/jwtGenerator';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary'
import withProtect from '../../middleware/withUser';
var FormData = require('form-data');
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: false
});

// PUT /api/publish/:id
const handler = async function handle(req, res) {
    // res.json({ test: 'test '});
    let { content, type, folder } = req.body;
    let { user_name } = req;
    if (!(folder === 'posts' || folder === 'profile')) {
        return res.status(500).send( `Invalid folder ${folder}`);
    }
    const timestamp = Math.round((new Date).getTime()/1000);
    const signature = await cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder
      },
      process.env.API_SECRET
    );
    const form = new FormData();
    form.append('file', content);
    form.append('folder', folder);
    try{
        const cloudinaryRes = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload?api_key=${process.env.API_KEY}&timestamp=${timestamp}&signature=${signature}`,
            {
              method: 'POST',
              body: form,
            }
          )
          const response = await cloudinaryRes.json();
        // const response = await cloudinary.uploader.upload(
        //     content,
        //     {
        //         folder,
        //         timestamp,
        //     },
        //     function(error, result) {
        //         console.log('callback', result, error)
        //     },
        // );
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
        res.status(500).send("Server Error: "  + err.message);
    }
}

export default withProtect(handler);
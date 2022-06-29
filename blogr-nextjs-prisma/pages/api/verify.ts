// pages/api/publish/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'
const jwt = require("jsonwebtoken");

import prisma from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import { jwtGenerator } from '../../utils/jwtGenerator';

// PUT /api/publish/:id
export default async function handle(req: NextApiRequest, res:NextApiResponse) {
    
    const jwtToken = req.headers["token"];
    
    if(!jwtToken){
        return res.status(403).json("Not Authorized")
    }
    try {
        
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        const user = payload.user;
        res.json(true);
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
}

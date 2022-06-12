const jwt = require("jsonwebtoken");
require('dotenv').config();

export function jwtGenerator(user_name: string){
    const payload = {
        user: user_name
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});
}

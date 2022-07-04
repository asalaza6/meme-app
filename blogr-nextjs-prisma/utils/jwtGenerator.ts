const jwt = require("jsonwebtoken");

export function jwtGenerator(user_name: string){
    const payload = {
        user: user_name
    }
    return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1hr"});
}

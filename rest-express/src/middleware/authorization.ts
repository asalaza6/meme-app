const jwt = require("jsonwebtoken");
require("dotenv").config()

export const authorizeMiddleware = async (req: { header: (arg0: string) => any; user: any; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): any; new(): any; }; }; }, next: () => void) => {
    
    const jwtToken = req.header("token");
    
    if(!jwtToken){
        return res.status(403).json("Not Authorized")
    }
    try {
        
        const payload = jwt.verify(jwtToken, process.env.jwtSecret);
        req.user = payload.user;
        next();
    } catch (err: any) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
}
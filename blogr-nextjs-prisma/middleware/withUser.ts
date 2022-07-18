import jwt from 'jsonwebtoken';

const withProtect = (handler, bypass = []) => {
  return async (req, res) => {
    if (bypass.includes(req.method)) return handler(req, res);
    const jwtToken = req.headers["token"];

    if(!jwtToken){
        return res.status(403).json("Not Authorized")
    }
    try {
        
        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user_name = payload.user;
        return handler(req, res);
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("Not Authorized");
    }
  };
};

export default withProtect;
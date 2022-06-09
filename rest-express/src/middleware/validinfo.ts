export const validInfoMiddleware = function(req: { body: { email: any; name: any; password: any; }; path: string; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): any; new(): any; }; }; json: (arg0: string) => any; }, next: () => void) {
    const { email, name, password } = req.body;
    //console.log("validating info here bro");
    function validEmail(userEmail: string) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    function validUsername(name: string){
      return /^\S+\w{4,32}\S{1,}/.test(name);
    }
  
    if (req.path === "/register") {
      //console.log(!email.length);
      if (![email, name, password].every(Boolean)) {
        return res.status(401).json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.json("Invalid Email");
      } else if(!validUsername(name)){
        return res.json("Username must be 6-34 characters long");
      }
    } else if (req.path === "/login") {
      if (![email, password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(email)) {
        return res.json("Invalid Email");
      }
    }
  
    next();
  };

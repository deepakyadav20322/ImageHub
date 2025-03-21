import { NextFunction,Response,Request } from "express";

export const determineAuthType = (req: Request, res: Response, next: NextFunction): void => {
    // const authHeader = req.headers.authorization;

    // if token present then it means it is dashboard call
    const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : req.headers.authorization ||
      req.cookies?.token ||
      req.query?.token ||
      req.body?.token;

    const apiKey = req.headers["x-api-key"];
    const authType = req.headers["x-auth-type"];
  
    console.log('it determine run ',token?true:false,"authType :",authType)

    if (authType === "narmal" && token) {
      req.authType = "narmal"; // Dashboard request (JWT)
    } else if (authType === "sdk" && apiKey) {
      req.authType = "sdk"; // SDK request (API Key)
    } else {
    // if nothing provided then by default assume it is dashboard call
    req.authType = "narmal"; 
    //   return res.status(401).json({ error: "Invalid authentication" });
    }
  
    next();
  };
  
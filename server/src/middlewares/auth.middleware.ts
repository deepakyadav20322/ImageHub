import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// here we extend the request object type and add user object // 👉 Todo: Better way handle it (requstType.d.ts)

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
):Promise<any> => {
  try {
    // Extract token from various sources
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.headers.authorization ||
        req.cookies?.token ||
        req.query?.token ||
        req.body?.token;

        console.log("kuchh aaya hai in middleware...")
    // If no token, return unauthorized error
    if (!token) {
      return res
        .status(401)
        .json({ message: "Authorization token is required" });
    }

    // Ensure JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in environment variables.");
      return res.status(500).json({ message: "Internal server error" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    // Attach user data to request
    req.user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error: unknown) {
    console.error("JWT Authentication Error:", error);

    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please log in again." });
      }

      if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .json({ message: "Invalid token. Please log in again." });
      }
    }

    // Generic error handling
    return res
      .status(500)
      .json({ message: "Authentication failed due to server problem" });
  }
};

export default authMiddleware;

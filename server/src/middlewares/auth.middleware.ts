import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserPermissions } from "../controlers/auth.controler";

// here we extend the request object type and add user object // 👉 Todo: Better way handle it (requstType.d.ts)

async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  if (req.authType === "sdk") {
    next();
  }
  console.log("auth midd run")
  try {
    // Extract token from various sources
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.headers.authorization ||
        req.cookies?.token ||
        req.query?.token ||
        req.body?.token;

    console.log("kuchh aaya hai in middleware...");
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
    /* initially here we give any type but when you define all the aspect of user in token then you assign a proper type or interface*/
    const decoded = (await jwt.verify(
      token,
      process.env.JWT_SECRET as string
    )) as any;
    const userData = await getUserPermissions(decoded?.userId);
    console.log(userData);

    if (!userData)
      return res
        .status(401)
        .json({ message: "User not found or no role assigned" });

    // Attach user data to request
    req.user = { ...decoded, permissions: userData.permissions };

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
        return res.status(401).json({ message: "Unauthorized" });
      }
    }

    // Generic error handling
    return res
      .status(500)
      .json({ message: "Authentication failed due to server problem" });
  }
}

export default authMiddleware;

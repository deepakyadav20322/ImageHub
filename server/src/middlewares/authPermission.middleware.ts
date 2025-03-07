import { Request, Response, NextFunction } from "express";

export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return; // Stop execution after sending the response
    }

    const userPermissions = req.user.permissions || [];

    const hasPermission = requiredPermissions.every((perm) =>
      userPermissions.includes(perm)
    );
    if (!hasPermission) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return; // Stop execution after sending the response
    }

    next(); // Continue to the next middleware/route handler
  };
};
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

// Global Error Handler
const globalErrorHandler = (
  err: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
//   console.error("💥 ERROR →", err);

  // Handle known operational errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  // Handle unknown errors (e.g., syntax issues, crashes)
  res.status(500).json({
    status: "error",
    message: "Something went wrong! Please try again later. Server error",
  stack: err.stack 
  });
};

export default globalErrorHandler;

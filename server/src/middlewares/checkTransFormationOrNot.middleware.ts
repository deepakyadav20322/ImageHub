import { Request, Response, NextFunction } from "express";
import { SUPPORTED_TRANSFORM_KEYS } from "../utils/transformations";


// ✅ Check if given string is a valid transformation string
const isTransformationString = (str: string): boolean => {
    if (!str) return false;
  
    const parts = str.split(',');
  
    return parts.every(part => {
      if (SUPPORTED_TRANSFORM_KEYS.includes(part)) return true;
  
      const matchedKey = SUPPORTED_TRANSFORM_KEYS.find(key =>
        part.startsWith(`${key}_`)
      );
  
      return !!matchedKey;
    });}
    
// ✅ Middleware to separate transformation from path
export const checkWithTransformOrNot = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { bucket, transformations, path } = req.params;

  if (isTransformationString(transformations)) {
    req.params.transformations = transformations;
    req.params.path = path;
  } else {
    req.params.transformations = ""; // No transformation
    req.params.path = `${transformations}/${path}`; // It's part of the path
  }

  console.log("✅ Final Params:", req.params);
  next();
};

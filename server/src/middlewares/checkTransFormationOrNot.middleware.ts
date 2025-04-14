import { Request, Response, NextFunction } from "express";
import { SUPPORTED_TRANSFORM_KEYS } from "../utils/transformations";

// ✅ Check if given string is a valid transformation string
const isTransformationString = (str: string): boolean => {
  if (!str) return false;

  const parts = str?.split(',');

  return parts.every(part => {
    if (SUPPORTED_TRANSFORM_KEYS.includes(part)) return true;

    const matchedKey = SUPPORTED_TRANSFORM_KEYS.find(key =>
      part.startsWith(`${key}_`)
    );

    return !!matchedKey;
  });
};

// ✅ Middleware to separate transformation from path
export const checkWithTransformOrNot = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { path:rest } = req.params; // e.g., "w_300,h_400/LandingPage.png" or just "LandingPage.png"
  const parts = rest?.split('/');
  const first = parts[0];
  const remaining = parts.slice(1).join('/');

  if (isTransformationString(first)) {
    req.params.transformations = first;
    req.params.path = remaining;
  } else {
    req.params.transformations = "";
    req.params.path = rest;
  }

  console.log("✅ Final Params:", req.params);
  next();
};

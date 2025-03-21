import { NextFunction, Request, Response } from "express";
import { db } from "../db/db_connect";
import { verifySecret } from "../utils/apiKeyHandler";
import { eq } from "drizzle-orm";
import { apiKeys } from "../db/schema";

export const authenticateApiKey = async (
  req: Request,
  res: Response,
  next: NextFunction

): Promise<void> => {

  console.log("auth api check midd run")
if(req.authType==='narmal'){
  next();
  return
}

  const apiKey = req.headers["x-api-key"] as string;
  const apiSecret = req.headers["x-api-secret"] as string; // Include this in your requests securely

  if (!apiKey || !apiSecret) {
    res.status(401).json({ error: "API Key and Secret are required." });
    return;
  }

  const [apiKeyData] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.apiKey, apiKey));

  if (!apiKeyData) {
    res.status(403).json({ error: "Invalid API Key." });
    return;
  }

  const isValidSecret = await verifySecret(apiSecret, apiKeyData.apiSecret);

  if (!isValidSecret) {
    res.status(403).json({ error: "Invalid API Secret." });
    return;
  }

  //   // Attach account details to request
  //   req.accountId = apiKeyData.accountId; // already re.user have  accountId
  next();
};

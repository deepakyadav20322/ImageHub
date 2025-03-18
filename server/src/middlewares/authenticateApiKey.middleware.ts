import { NextFunction, Request, Response } from 'express';
import { db } from '../db/db_connect'; 
import { verifySecret } from '../utils/apiKeyHandler';
import { eq } from 'drizzle-orm';
import { apiKeys } from '../db/schema';

export const authenticateApiKey = async(req: Request, res: Response, next: NextFunction)=> {
  const apiKey = req.headers['x-api-key'] as string;
  const apiSecret = req.headers['x-api-secret'] as string; // Include this in your requests securely

  if (!apiKey || !apiSecret) {
    return res.status(401).json({ error: "API Key and Secret are required." });
  }

  const [apiKeyData] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.apiKey, apiKey));

  if (!apiKeyData) {
    return res.status(403).json({ error: "Invalid API Key." });
  }

  const isValidSecret = await verifySecret(apiSecret, apiKeyData.apiSecret);

  if (!isValidSecret) {
    return res.status(403).json({ error: "Invalid API Secret." });
  }

//   // Attach account details to request
//   req.accountId = apiKeyData.accountId; // already re.user have  accountId
  next();
}

import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateApiKey = ()=> {
  return crypto.randomBytes(32).toString('hex'); // Example: "a2b3c4d5..."
}

export const  generateApiSecret = ()=> {
  return crypto.randomBytes(64).toString('hex'); // Longer for added security
}



export const hashSecret = async (secret: string): Promise<string> => {
    return await bcrypt.hash(secret, 10);
}

export const verifySecret = async (secret: string, hashedSecret: string): Promise<boolean> => {
    return await bcrypt.compare(secret, hashedSecret);
}

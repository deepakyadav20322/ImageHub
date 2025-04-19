import jwt, { SignOptions } from 'jsonwebtoken';

export const generateJWTtoken = (
	data: any,
	time: number = 60 * 60 * 24 // Allow numbers (seconds) or strings (e.g., "1h", "2d")
) => {
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}

	const secret = process.env.JWT_SECRET;

	// Properly typed SignOptions
	const options: SignOptions = {
		expiresIn: time,
	};

	return jwt.sign(data, secret, options);
};
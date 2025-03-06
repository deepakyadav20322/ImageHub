
import jwt from 'jsonwebtoken'

export const generateJWTtoken = (data:any)=>{
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET is not defined');
	}
	const token = jwt.sign(data, process.env.JWT_SECRET);
	return token;
}


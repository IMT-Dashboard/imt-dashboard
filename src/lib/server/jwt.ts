import type { User } from '$lib/models/user.model';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export function jwtDecode(authToken: string | undefined): User | null {
	if (!authToken) return null;
	const decoded = jwt.decode(authToken) as JwtPayload;
	return decoded as User;
}

export function jwtSign(user: User): string | null {
	try {
		return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
	} catch (err: any) {
		return null;
	}
}

export function verifyJwt(authToken: string): boolean {
	if (!authToken) return false;
	try {
		return !!jwt.verify(authToken, JWT_SECRET);
	} catch (err: any) {
		console.log('Error verifying JWT: ', err);
		return false;
	}
}

export function verifyAndDecode(authToken: string | undefined): User | null {
	if (!authToken || !verifyJwt(authToken)) return null;
	return jwtDecode(authToken);
}

import type { Cookies } from '@sveltejs/kit';
import type { User } from '$lib/models/user';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

export function jwtDecode(cookies: Cookies): User | null {
	const cookieAuthToken = cookies.get('authToken');
	if (!cookieAuthToken) return null;

	const decoded = jwt.decode(cookieAuthToken) as JwtPayload;
	return decoded as User;
}

export function jwtSign(user: User): string | null {
	try {
		return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
	} catch (err: any) {
		return null;
	}
}

export function verifyJwt(cookies: Cookies): boolean {
	const cookieAuthToken = cookies.get('authToken');
	if (!cookieAuthToken) return false;

	try {
		return !!jwt.verify(cookieAuthToken, JWT_SECRET);
	} catch (err: any) {
		console.log('Error verifying JWT: ', err);
		return false;
	}
}

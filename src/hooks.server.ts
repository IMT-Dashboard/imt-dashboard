import { type Handle, redirect, type ServerInit } from '@sveltejs/kit';
import { verifyJwt } from '$lib/server/jwt';

const unProtectedRoutes = ['/login', '/api/authentication/login', '/api/authentication/user'];

export const handle: Handle = async ({ event, resolve }) => {
	const gradesCookie = event.cookies.get('cybernotes');
	const authToken = event.cookies.get('authToken');

	if (!unProtectedRoutes.includes(event.url.pathname)) {
		try {
			verifyJwt(authToken!);
		} catch (err: any) {
			event.cookies.delete('authToken', { path: '/' });
			redirect(303, '/login');
		}
		if (!gradesCookie || !authToken) {
			redirect(303, '/login');
		}
	}
	return resolve(event);
};

export const init: ServerInit = async () => {
	// await db.connect();
};

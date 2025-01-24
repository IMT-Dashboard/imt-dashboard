import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('cybernotes', { path: '/' });
	cookies.delete('authToken', { path: '/' });
	// cookies.delete('PHPSESSID', { path: '/' });
	redirect(303, '/login');
};

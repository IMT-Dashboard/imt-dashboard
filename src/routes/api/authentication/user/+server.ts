import { json, type RequestHandler } from '@sveltejs/kit';
import { jwtDecode } from '$lib/server/jwt';

export const GET: RequestHandler = async ({ cookies }) => {
	try {
		const authToken = cookies.get('authToken');
		const user = jwtDecode(authToken);
		if (!user) return json({ message: 'Unauthorized: Invalid token' }, { status: 401 });

		return new Response(JSON.stringify(user), { status: 200 });
	} catch (err) {
		return json({ message: 'Error while fetching academic record' }, { status: 500 });
	}
};

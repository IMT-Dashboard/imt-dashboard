import { error, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({}) => {
	try {
		return new Response(JSON.stringify({}), {
			status: 200
		});
	} catch (err) {
		console.log(err);
		error(500, 'Error while fetching grades');
	}
};

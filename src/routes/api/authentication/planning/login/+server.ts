import { json, type RequestHandler } from '@sveltejs/kit';
import FormData from 'form-data';
import axios from 'axios';
import { decrypt } from '$lib/server/password.utils';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const formData = await request.formData();
	let username = formData.get('username') as string;
	let password = formData.get('password') as string;
	let encryptedPassword = formData.get('encryptedPassword') as string;
	if (!password && encryptedPassword) {
		password = decrypt(encryptedPassword);
	}

	const phpSessionId = await loginToSchedule(username, password);

	cookies.set('PHPSESSID', phpSessionId as string, {
		path: '/',
		expires: new Date(Date.now() + 1000 * 60 * 60)
	});

	return json({ message: 'Successfully logged to planning' });
};

async function loginToSchedule(username: string, password: string): Promise<string> {
	const loginData = new FormData();
	loginData.append('Username', username);
	loginData.append('Password', password);
	loginData.append('url', '');
	loginData.append('login', '');

	const cookieRequest = await fetch(`https://webdfd.mines-ales.fr/planning-eleves/login/login.php`);
	const phpSessionId = cookieRequest.headers.get('set-cookie')?.split(';')[0].split('=')[1];

	const response = await axios.post(
		'https://webdfd.mines-ales.fr/planning-eleves/index.php?url=ics/eleve/14636',
		loginData,
		{
			maxBodyLength: Infinity,
			headers: {
				Cookie: `PHPSESSID=${phpSessionId}`,
				...(loginData.getHeaders?.() || {})
			}
		}
	);

	if (response.data.includes('Bienvenue sur planning')) {
		return phpSessionId as string;
	}
	throw new Error('Login failed');
}

import { json, type RequestHandler } from '@sveltejs/kit';
import { jwtSign } from '$lib/server/jwt';
import { students } from '$lib/data/students';
import FormData from 'form-data';
import axios from 'axios';
import { decrypt, encrypt } from '$lib/server/password.utils';
import type { User } from '$lib/models/user.model';
import type { Promotion } from '$lib/data/semester';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const formData = await request.formData();
	let username = formData.get('username') as string;
	let password = formData.get('password') as string;
	let encryptedPassword = formData.get('encryptedPassword') as string;
	if (!password && encryptedPassword) {
		password = decrypt(encryptedPassword);
	}

	username = username.toLowerCase();

	try {
		const cookiesCybernotesValue = await loginToCybernotes(username, password);
		cookies.set('cybernotes', cookiesCybernotesValue as string, {
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 60)
		});
	} catch (err: any) {
		return json({ message: 'Invalid credentials' }, { status: 401 });
	}

	const [firstname, lastname] = username.split('.');
	const student = students.find((user: any) => user.lastname === lastname && user.firstname === firstname);
	if (!student) return json({ message: 'Invalid user' }, { status: 401 });

	const user: User = {
		username,
		firstname,
		lastname,
		id: student.id,
		promotion: student.promotion as Promotion
	};

	const authToken = jwtSign(user);
	cookies.set('authToken', authToken!, {
		httpOnly: true,
		maxAge: 3600,
		path: '/'
	});

	return new Response(JSON.stringify({ encryptedPassword: encrypt(password) }), { status: 200 });
};

function loginToCybernotes(username: string, password: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const data = new FormData();
		data.append('id', username);
		data.append('pwd', password);
		const cookieRequest = await axios.get(`https://webdfd.mines-ales.fr/cybernotes/debut.php?id=${username}`);
		const cookies = cookieRequest.headers['set-cookie'];
		if (!cookies) {
			reject();
			return;
		}
		const cookieCybernotes = cookies?.find((cookie: string) => cookie.includes('cybernotes'));
		if (!cookieCybernotes) {
			reject();
			return;
		}
		const cookiesCybernotesValue = cookieCybernotes.split(';')[0].split('=')[1];

		const response = await axios.post('https://webdfd.mines-ales.fr/cybernotes/debut.php', data, {
			headers: {
				Cookie: `cybernotes=${cookiesCybernotesValue}`,
				...data.getHeaders()
			}
		});

		if (response.data.includes('Redirection en cours')) {
			resolve(cookiesCybernotesValue as string);
		}
		reject();
	});
}

import { error, type RequestHandler } from '@sveltejs/kit';
import { jwtSign } from '$lib/server/jwt';
import { students } from '$lib/data/students';
import type { User } from '$lib/models/user.model';
import FormData from 'form-data';
import axios from 'axios';
import { decrypt, encrypt } from '$lib/server/password-utils';
import type { Promotion } from '$lib/data/semester';

export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
	const formData = await request.formData();
	let username = formData.get('username') as string;
	let password = formData.get('password') as string;
	let encryptedPassword = formData.get('encryptedPassword') as string;
	if (!password && encryptedPassword) {
		password = decrypt(encryptedPassword);
	}

	username = username.toLowerCase();

	try {
		const cookiesCybernotesValue = await loginToCybernotes(fetch, username, password);
		cookies.set('cybernotes', cookiesCybernotesValue as string, {
			path: '/',
			expires: new Date(Date.now() + 1000 * 60 * 60)
		});
	} catch (e) {
		console.error('Invalid credentials');
		error(401, 'Invalid credentials');
	}

	const [firstname, lastname] = username.split('.');
	const student = students.find((user: any) => user.lastname === lastname && user.firstname === firstname);
	if (!student) {
		error(401, 'Invalid user');
	}

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

function loginToCybernotes(fetch: any, username: string, password: string): Promise<string> {
	return new Promise(async (resolve, reject) => {
		const data = new FormData();
		data.append('id', username);
		data.append('pwd', password);
		const cookieRequest = await fetch(`https://webdfd.mines-ales.fr/cybernotes/debut.php?id=${username}`);
		const cookiesCybernotesValue = cookieRequest.headers.get('set-cookie')?.split(';')[0].split('=')[1];

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

import crypto from 'crypto';
import { KEY_PASSWORD, SALT_PASSWORD } from '$env/static/private';

const algorithm = 'aes-256-cbc';

export function encrypt(text: string): string {
	const iv = Buffer.alloc(16, 0);
	const key = crypto.scryptSync(KEY_PASSWORD, SALT_PASSWORD, 32);
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(text, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	return encrypted;
}

export function decrypt(encryptedText: string): string {
	const iv = Buffer.alloc(16, 0);
	const key = crypto.scryptSync(KEY_PASSWORD, SALT_PASSWORD, 32);
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

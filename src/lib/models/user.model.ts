import type { Promotion } from '$lib/data/semester';

export interface User {
	username: string;
	firstname: string;
	lastname: string;
	promotion: Promotion;
	id: string;
}

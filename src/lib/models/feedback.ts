export interface Feedback {
	type: 'error' | 'warning' | 'info' | 'success';
	message: string;
}

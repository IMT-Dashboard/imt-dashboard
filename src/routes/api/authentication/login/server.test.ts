import { beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './+server';
import axios from 'axios';

vi.mock('axios');

describe('POST /login', () => {
	const mockCookies = {
		set: vi.fn(),
		get: vi.fn()
	};

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should return 401 when credentials are invalid', async () => {
		// Arrange
		vi.mocked(axios.get).mockResolvedValueOnce({
			headers: {}
		});

		const formData = new Map();
		formData.set('username', 'invalid.user');
		formData.set('password', 'wrongpassword');

		const request = {
			formData: async () => formData
		};

		// Act
		const response = await POST({
			request,
			cookies: mockCookies
		} as any);

		// Assert
		expect(response.status).toBe(401);

		const responseBody = await response.json();
		expect(responseBody.message).toBe('Invalid credentials');
	});

	it('should return 401 when user does not exist', async () => {
		// Arrange
		vi.mocked(axios.get).mockResolvedValueOnce({
			headers: {
				'set-cookie': ['cybernotes=mockedValue; Path=/; HttpOnly']
			}
		});
		vi.mocked(axios.post).mockResolvedValueOnce({
			data: 'Redirection en cours'
		});

		const formData = new Map();
		formData.set('username', 'nonexistent.user');
		formData.set('password', 'password123');

		const request = {
			formData: async () => formData
		};

		// Act
		const response = await POST({
			request,
			cookies: mockCookies
		} as any);

		// Assert
		expect(response.status).toBe(401);

		const responseBody = await response.json();
		expect(responseBody.message).toBe('Invalid user');
	});
});

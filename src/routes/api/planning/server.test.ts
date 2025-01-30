import { verifyAndDecode } from '$lib/server/jwt';
import type { User } from '$lib/models/user.model';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { GET } from './+server';
import type { HttpError } from '@sveltejs/kit';

vi.mock('$lib/server/jwt', () => ({
	verifyAndDecode: vi.fn()
}));

vi.mock('axios', () => ({
	default: {
		get: vi.fn()
	}
}));

describe('GET /api/schedule', () => {
	const cookiesMock = { get: vi.fn() };
	const mockUser: User = {
		firstname: 'jean',
		id: '0',
		lastname: 'moulin',
		promotion: 'infres16',
		username: 'jean.moulin'
	};

	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should return 401 if user is unauthorized', async () => {
		vi.mocked(verifyAndDecode).mockReturnValue(null);

		try {
			const response = await GET({ cookies: cookiesMock } as any);
		} catch (e) {
			expect((e as HttpError).status).toBe(401);
		}
	});

	it('should return 404 if no events found', async () => {
		vi.mocked(verifyAndDecode).mockResolvedValue(mockUser);
		cookiesMock.get.mockReturnValue('mocked-session-id');
		vi.mocked(axios.get).mockResolvedValue({ data: '' });

		await expect(GET({ cookies: cookiesMock } as any)).rejects.toMatchObject({ status: 404 });
	});

	it('should fetch and parse the calendar correctly', async () => {
		vi.mocked(verifyAndDecode).mockResolvedValue(mockUser);
		cookiesMock.get.mockReturnValue('mocked-session-id');

		const icsData = `BEGIN:VCALENDAR\nBEGIN:VEVENT\nSUMMARY:Math Class\nDTSTART:20230201T090000Z\nDTEND:20230201T103000Z\nDESCRIPTION:Algebra Lesson\nLOCATION:Room 101\nEND:VEVENT\nEND:VCALENDAR`;

		vi.mocked(axios.get).mockResolvedValue({ data: Buffer.from(icsData, 'latin1') });

		const response = await GET({ cookies: cookiesMock } as any);

		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body).toMatchObject([
			{
				summary: 'Math Class',
				description: 'Algebra Lesson',
				location: 'Room 101',
				start: new Date('2023-02-01T09:00:00Z').toISOString(),
				end: new Date('2023-02-01T10:30:00Z').toISOString()
			}
		]);
	});
});

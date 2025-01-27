import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from './+server';
import { jwtDecode } from '$lib/server/jwt';
import axios from 'axios';

describe('GET /api/academic-record', () => {
	vi.mock('$lib/server/jwt', () => ({
		jwtDecode: vi.fn()
	}));
	vi.mock('axios', () => ({
		default: {
			get: vi.fn()
		}
	}));

	const cookiesMock = { get: vi.fn() };
	const paramsMock = { semester: '5' };
	const mockUser = { promotion: 'infres16' };

	beforeEach(() => vi.clearAllMocks());

	it('should return 401 if user is unauthorized', async () => {
		// Arrange
		(jwtDecode as any).mockReturnValue(null);

		// Act
		const response = await GET({
			cookies: cookiesMock,
			params: paramsMock
		} as any);

		// Assert
		expect(response.status).toBe(401);
	});

	it('should return 400 if semester is invalid', async () => {
		// Act
		const response = await GET({
			cookies: cookiesMock,
			params: { semester: null }
		} as any);

		// Assert
		expect(response.status).toBe(400);
	});

	it('should fetch academic record and return it', async () => {
		// Arrange
		(jwtDecode as any).mockReturnValue(mockUser);

		cookiesMock.get.mockReturnValue('mocked-cookie');

		const htmlResponse = `
            <html>
                <table>
                    <tr>
                        <td class="SousTitre">Mathématiques (01/01/2023)</td>
                        <td>Coef. 3</td>
                        <td><font><b>18.5</b></font></td>
                    </tr>
                </table>
            </html>
        `;
		(axios.get as any).mockResolvedValue({ data: Buffer.from(htmlResponse, 'latin1') });

		// Act
		const response = await GET({
			cookies: cookiesMock,
			params: paramsMock
		} as any);

		// Assert
		expect(response.status).toBe(200);

		const body = await response.json();
		expect(body).toEqual({
			'5': {
				grades: [
					{
						name: 'Mathématiques',
						mark: 18.5,
						associatedModule: null,
						coeff: 0
					}
				],
				modules: [],
				isAllowed: true
			},
			hasError: false
		});
	});

	it('should return 500 on errors', async () => {
		// Arrange
		(jwtDecode as any).mockImplementation(() => {
			throw new Error('mocked-error');
		});

		// Act
		const response = await GET({
			cookies: cookiesMock,
			params: paramsMock
		} as any);

		// Assert
		expect(response.status).toBe(500);
	});
});

import { error, type RequestHandler } from '@sveltejs/kit';
import ical from 'node-ical';
import axios from 'axios';
import type { Subject } from '$lib/models/schedule.model';
import { verifyAndDecode } from '$lib/server/jwt';

export const GET: RequestHandler = async ({ cookies, fetch }) => {
	const sessId = cookies.get('PHPSESSID');

	const user = verifyAndDecode(cookies.get('authToken'));
	if (!user) error(401, 'Unauthorized');

	const calendarResponse = await axios.get(
		`https://webdfd.mines-ales.fr/planning-eleves/index.php?url=ics/eleve/${user.id}`,
		{
			headers: { Cookie: `PHPSESSID=${sessId}` },
			responseType: 'arraybuffer',
			responseEncoding: 'latin1'
		}
	);

	let decodedData = calendarResponse.data.toString('latin1');
	const parsedData = ical.parseICS(decodedData);
	const events = Object.values(parsedData)
		.filter((event) => event.type === 'VEVENT')
		.map(({ summary, start, end, description, location }: any) => ({ summary, start, end, description, location }));

	if (events.length === 0) {
		throw error(404, 'Not found');
	}

	let subjects: Subject[] = [];
	for (const event of events) {
		const summary = event.summary;
		const description = event.description;
		const location = event.location;
		const [start, end] = [new Date(event.start), new Date(event.end)];
		subjects.push({ summary, description, location, start, end });
	}

	return new Response(JSON.stringify(subjects));
};

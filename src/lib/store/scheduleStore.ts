import { type Writable, writable } from 'svelte/store';
import type { Subject } from '$lib/models/schedule.model';

export const scheduleStore: Writable<Subject[]> = writable([]);

export async function fillScheduleStore() {
	const currentSchedule = await fetch('/api/schedule');
	if (!currentSchedule.ok) {
		await fetch('/api/authentication/logout', {
			method: 'POST'
		});
	}
	const scheduleResponse = await currentSchedule.json();
	if (!scheduleResponse || scheduleResponse.message) {
		scheduleStore.set([
			{
				end: new Date('10/02/2000'),
				start: new Date('10/02/2000'),
				description: '',
				location: '',
				summary: ''
			}
		]);
	} else {
		for (const subject of scheduleResponse) {
			subject.start = new Date(subject.start);
			subject.end = new Date(subject.end);
		}
		scheduleStore.set(scheduleResponse);
	}
}

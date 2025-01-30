import { scheduleStore } from '$lib/store/schedule.store';

export async function fillScheduleStore() {
	const currentSchedule = await fetch('/api/planning');
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

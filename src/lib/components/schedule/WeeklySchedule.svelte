<script lang="ts">
	import { get } from 'svelte/store';
	import WeeklySubject from '$lib/components/schedule/WeeklySubject.svelte';
	import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { Subject } from '$lib/models/schedule.model';
	import { getDayOfDate, isDateInWeek } from '$lib/server/miscellaneous.utils';
	import { fillScheduleStore, scheduleStore } from '$lib/store/scheduleStore';
	import CircleLoader from '$lib/components/CircleLoader.svelte';

	let schedule: Subject[] = $state([]);

	let day = $state(new Date());
	let error = $state(false);
	let weeklySchedule: { [key: string]: Subject[] } = $state({});

	$effect(() => {
		day = startOfWeek(day);
		loadSchedule();
		$effect(() => {
			schedule = $scheduleStore;
		});
	});

	function startOfWeek(date: Date) {
		const dayOffset = date.getDay() - 1; // Start week on Monday
		return new Date(date.getTime() - dayOffset * 24 * 60 * 60 * 1000);
	}

	async function loadSchedule() {
		if (!Object.keys(get(schedule)).length) {
			await fillScheduleStore();
		}
		filterScheduleByWeek();
	}

	function filterScheduleByWeek() {
		const _schedule = get(schedule);
		weeklySchedule = _schedule
			.filter((event) => isDateInWeek(event.start, day))
			.reduce((acc: { [key: string]: Subject[] }, subject: Subject) => {
				const dayKey = getDayOfDate(subject.start);
				(acc[dayKey] = acc[dayKey] || []).push(subject);
				return acc;
			}, {});
	}

	function changeWeek(amount: number) {
		day = new Date(day.getTime() + amount * 7 * 24 * 60 * 60 * 1000);
		filterScheduleByWeek();
	}

	function changeByCalendar(event: Event) {
		const target = event.target as HTMLInputElement;
		day = new Date(target.value);
		filterScheduleByWeek();
	}

	function getDayName(index: number) {
		const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
		return days[index];
	}
</script>

<div class="schedule">
	<div class="week-control">
		<button class="week-button" disabled={error} onclick={() => changeWeek(-1)}>
			<Fa color="white" icon={faChevronLeft} />
		</button>
		<input
			class="input-date week-input"
			disabled={error}
			onchange={changeByCalendar}
			step="7"
			type="date"
			value={day.toISOString().split('T')[0]}
		/>
		<button class="week-button" disabled={error} onclick={() => changeWeek(1)}>
			<Fa color="white" icon={faChevronRight} />
		</button>
	</div>
	{#if error}
		<p>Erreur lors du chargement de l'emploi du temps</p>
	{:else if !get(scheduleStore).length}
		<CircleLoader />
	{:else if !Object.keys(weeklySchedule).length}
		<p>Aucun cours pour cette semaine</p>
	{:else}
		<div class="week-grid">
			<!-- Time Rows -->
			{#each Array.from({ length: 48 }, (_, i) => i) as hour}
				<div class="grid-container" style="grid-row: {hour + 2};">
					{hour % 4 === 0 ? hour / 4 + 8 + 'h' : ''}
				</div>
			{/each}

			<!-- Day Columns -->
			{#each Array.from({ length: 5 }, (_, i) => i) as dayIndex}
				<div class="day-title" style="grid-column: {dayIndex + 2};">{getDayName(dayIndex)}</div>
			{/each}

			<!-- Subjects -->
			{#each Object.entries(weeklySchedule) as [dayKey, subjects]}
				{#each subjects as subject}
					<WeeklySubject {subject}></WeeklySubject>
				{/each}
			{/each}
		</div>
	{/if}
</div>

<style>
	.schedule {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.week-control {
		display: flex;
		justify-content: space-around;
		margin-bottom: 10px;
		gap: 20px;
	}

	.week-button {
		background-color: var(--primary-color);
		border: none;
		color: white;
		padding: 6px 12px;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		font-size: 16px;
		margin: 4px 2px;
		cursor: pointer;
		border-radius: 99px;
		transition-duration: 0.4s;
	}

	.week-grid {
		position: relative;
		display: grid;
		grid-template-columns: 40px repeat(5, 1fr);
		grid-template-rows: 20px repeat(48, 1fr);
		height: 500px;
		max-width: 90%;
		width: 90%;
		column-gap: 10px;
		font-size: 12px;
		text-align: center;
	}

	.grid-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	@media (max-width: 1100px) {
		.schedule {
			max-width: 100%;
		}
	}

	@media (max-width: 870px) {
		.week-grid {
			grid-template-columns: 18px repeat(5, 1fr);
			grid-template-rows: 20px repeat(48, 1fr);
		}
	}
</style>

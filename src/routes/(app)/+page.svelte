<script lang="ts">
	import Masonry from 'svelte-bricks';
	import GradesList from '$lib/components/grade/GradesList.svelte';
	import ModulesList from '$lib/components/module/ModulesList.svelte';
	import type { AcademicRecord } from '$lib/models/grades.model';
	import { academicRecordStore } from '../../stores/academic-record.store';
    import {getPreviousSemesters, getUserFromJwt} from '$lib/utils';
    import {onMount} from "svelte";

	let items = [GradesList, ModulesList];

	let minColWidth = 500;
	let maxColWidth = 600;
	let gap = 20;
	let width: number, height: number;

    onMount(async () => {
        const user = await getUserFromJwt();
        await fetchAcademicRecords(getPreviousSemesters(user.promotion));
    });

	async function fetchAcademicRecords(semesters: number[]) {
		const academicRecord: AcademicRecord = { hasError: false };

		await Promise.all(
			semesters.map(async (semester) => {
				try {
					const response = await fetch(`/api/academic-record/${semester}`);
					if (response.ok) {
						const data = await response.json();
						academicRecord[semester] = {
							...data[semester]
						};
					} else {
						console.error(`Error fetching data for semester ${semester}`);
						academicRecord[semester] = {
							isAllowed: false,
							grades: [],
							modules: [],
							error: `Error fetching data for semester ${semester}`
						};
					}
				} catch (err) {
					console.error(`Network error for semester ${semester}:`, err);
					academicRecord[semester] = {
						isAllowed: false,
						grades: [],
						modules: [],
						error: `Network error for semester ${semester}`
					};
					academicRecord.hasError = true;
				}
			})
		);
		academicRecordStore.set(academicRecord);
	}
</script>

<Masonry
	bind:masonryHeight={height}
	bind:masonryWidth={width}
	{gap}
	getId={(item) => items.indexOf(item)}
	{items}
	let:item
	{maxColWidth}
	{minColWidth}
>
	<svelte:component this={item} />
</Masonry>

<style>
	:global(div.masonry div.col > div) {
		display: flex;
		justify-content: center;
	}

	@media (max-width: 768px) {
		:global(div.masonry) {
			width: 95%;
			margin: 0 auto;
		}
	}
</style>

<script lang="ts">
	import type { Grade } from '$lib/models/grades.model';
	import GradeItem from '$lib/components/grade/GradeItem.svelte';
	import { academicRecordStore } from '../../../stores/academic-record.store';
	import {currentSemester} from "../../../stores/current-semester.store";

	let grades: Grade[] | null = $state(null);
	let error: boolean = $state(false);

    $effect(() => {
        const academicRecord = $academicRecordStore;
        error = academicRecord.hasError;
        grades = academicRecord[$currentSemester]?.grades ?? null;
    })
</script>

<div class="grades">
	<h2 class="title">Dernières notes</h2>
	<div class="grades-list">
		{#if grades && !error}
			{#each grades as grade}
				<GradeItem {grade} />
			{/each}
		{:else if !grades && !error}
			<p>Loading...</p>
		{:else}
			<p>{error}</p>
		{/if}
	</div>
</div>

<style>
	.grades {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.grades-list {
		display: flex;
		flex-direction: column;
	}
</style>

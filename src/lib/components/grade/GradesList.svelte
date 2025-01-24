<script lang="ts">
    import type {Grade} from "$lib/models/grades.model";
    import GradeItem from "$lib/components/grade/GradeItem.svelte";
    import {academicRecordStore} from "../../../stores/academic-record.store";
    import {CurrentSemester} from "$lib/data/semester";

    let grades: Grade[] | null = $state(null);
    let error: string | null = $state(null);

    $effect(() => {
        const academicRecord = $academicRecordStore;
        error = academicRecord.error ?? null;
        grades = academicRecord[CurrentSemester.infres17]?.grades ?? null;
    })
</script>

<div class="grades">
    <h2>Grades</h2>
    <div class="grades-list">
        {#if grades && !error}
            {#each grades as grade}
                <GradeItem {grade}/>
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
        gap: 20px;
    }

    .grades-list {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>
<script lang="ts">
    import type {Module} from "$lib/models/grades.model";
    import ModuleItem from "$lib/components/module/ModuleItem.svelte";
    import {academicRecordStore} from "../../../stores/academic-record.store";
    import {CurrentSemester} from "$lib/data/semester";

    let modules: Module[] | null = $state(null);
    let error: boolean = $state(false);

    $effect(() => {
        const academicRecord = $academicRecordStore;
        error = academicRecord.hasError;
        modules = academicRecord[CurrentSemester.infres16]?.modules;
    })
</script>

<div class="modules">
    <h2>Modules</h2>
    <div class="modules-list">
        {#if modules && !error}
            {#each modules as module}
                <ModuleItem {module}/>
            {/each}
        {:else if !modules && !error}
            <p>Loading...</p>
        {:else}
            <p>{error}</p>
        {/if}
    </div>
</div>

<style>
    .modules {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .modules-list {
        display: flex;
        flex-direction: column;
    }
</style>
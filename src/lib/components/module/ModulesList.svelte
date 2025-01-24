<script lang="ts">
    import type {Module} from "$lib/models/grades.model";
    import ModuleItem from "$lib/components/module/ModuleItem.svelte";
    import {academicRecordStore} from "../../../stores/academic-record.store";
    import {CurrentSemester} from "$lib/data/semester";

    let modules: Module[] | null = $state(null);

    $effect(() => {
        modules = $academicRecordStore[CurrentSemester.infres17]?.modules ?? null;
    })
</script>


<div class="modules">
    <h2>Modules</h2>
    <div class="modules-list">
        {#if modules}
            {#each modules as module}
                <ModuleItem {module}/>
            {/each}
        {:else}
            <p>Loading...</p>
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
        gap: 20px;
    }
</style>
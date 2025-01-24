<script lang="ts">
    import Masonry from 'svelte-bricks';
    import GradesList from "$lib/components/grade/GradesList.svelte";
    import ModulesList from "$lib/components/module/ModulesList.svelte";
    import {academicRecordStore} from "../../stores/academic-record.store";

    let items = [GradesList, ModulesList];

    let minColWidth = 500;
    let maxColWidth = 600;
    let gap = 20;
    let width: number, height: number;

    // TODO STUB
    $effect(() => {
        load()
    });

    async function load() {
        const req = await fetch('/api/academic-record/5')
        if (req.ok) {
            const rep = await req.json()
            academicRecordStore.set(rep)
        } else {
            console.error('Error while fetching academic record')
            academicRecordStore.set({error: 'Error while fetching academic record'})
        }
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
    <svelte:component this={item}/>
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

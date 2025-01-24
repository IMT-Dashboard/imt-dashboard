<script lang="ts">
    import type {Module} from "$lib/models/grades.model";

    export let module: Module;
</script>

<p>{module.name} {module.grade} {module.letterGrade}</p>


<style>
    p {
        color: var(--text);
    }
</style>
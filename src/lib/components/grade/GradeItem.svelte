<script lang="ts">
    import type {Grade} from "$lib/models/grades.model";

    export let grade: Grade;
</script>


<p>{grade.coeff} - {grade.grade} - {grade.name}</p>

<style>
    p {
        color: var(--text);
    }
</style>
<script lang="ts">
	import WeeklyPlanning from '$lib/components/planning/WeeklySchedule.svelte';

	let { data } = $props();
</script>

<WeeklyPlanning isPlanningLoaded={data.isPlanningLoaded} />

<style>
</style>

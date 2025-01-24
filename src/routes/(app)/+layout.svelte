<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Sidebar />
	<main class="main">
		{@render children()}
	</main>
</div>

<style>
	.app {
		background-color: var(--background);
		display: flex;
	}
</style>

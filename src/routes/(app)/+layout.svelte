<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	let { children } = $props();
</script>

<div class="app">
	<Sidebar />
	<main>
		{@render children()}
	</main>
</div>

<style>
	main {
		flex: 1;
		color: var(--text);
	}
	.app {
		background-color: var(--background);
		display: flex;
		flex-direction: row;
	}
</style>

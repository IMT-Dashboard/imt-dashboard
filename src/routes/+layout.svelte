<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Sidebar.svelte';
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
</style>

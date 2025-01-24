<script lang="ts">
	import Sidebar from '$lib/components/Sidebar.svelte';

	import '../app.css';

	let { children } = $props();

	$effect(() => {
		let currentTheme = detectPreferredTheme();
		setTheme(currentTheme);
	});

	function setTheme(theme: string) {
		document.documentElement.setAttribute('data-theme', theme);
	}

	function detectPreferredTheme() {
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		return prefersDark ? 'dark' : 'light';
	}
</script>

<div class="app">
	<Sidebar />
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		background-color: var(--background-50);
	}
</style>

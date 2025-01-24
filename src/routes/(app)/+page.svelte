<script lang="ts">
	import Masonry from 'svelte-bricks';
	import CircleLoader from '$lib/components/CircleLoader.svelte';

	let items = [CircleLoader];

	let minColWidth = 500;
	let maxColWidth = 600;
	let gap = 20;
	let width: number, height: number;
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
	<svelte:component this={item} />
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

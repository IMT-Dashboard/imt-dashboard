<script lang="ts">
	import SubjectModal from '$lib/components/planning/SubjectModal.svelte';
	import type { Subject } from '$lib/models/schedule.model';
	import { formatHours, transformTextInColor } from '$lib/utils/miscellaneous.utils';

	const { subject } = $props<{ subject: Subject }>();

	let duration = $state(0);
	let showModal = $state(false);

	$effect(() => {
		duration = (subject.end.getTime() - subject.start.getTime()) / 60000;
	});

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') showModal = true;
	}
</script>

<!--TODO: BUG: WE CAN ONLY CLICK ONCE ON THE MODAL, THEN IT DOESN'T OPEN ANYMORE-->
<SubjectModal bind:showModal {subject} />

<div
	aria-label="Cliquez pour voir les détails"
	class="subject"
	onclick={() => (showModal = true)}
	onkeydown={handleKeydown}
	role="button"
	style="grid-row: {Math.floor(subject.start.getHours() - 8) * 4 + subject.start.getMinutes() / 15 + 2} / {Math.floor(
		subject.end.getHours() - 8
	) *
		4 +
		subject.end.getMinutes() / 15 +
		2}; grid-column: {subject.start.getDay() + 1}"
	tabindex="0"
>
	<div class="subject-bar" style="background-color: {transformTextInColor(subject.summary)}"></div>
	<div class="subject-content">
		{#if duration > 15}
			<p class="summary">{subject.summary}</p>
			{#if duration > 89}
				<div class="subject-info">
					{#if duration > 120}
						<p>{subject.location}</p>
						<p>{subject.description}</p>
					{/if}
					<p>{formatHours(subject.start)} - {formatHours(subject.end)}</p>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.subject {
		padding: 5px;
		font-size: 12px;
		display: flex;
		gap: 10px;
		border-radius: 5px;
		background: var(--background);
		overflow: hidden;
		cursor: pointer;
	}

	p {
		margin: 0;
	}

	.subject-bar {
		min-width: 7px;
		height: 100%;
		border-radius: 5px;
	}

	.subject-content {
		display: flex;
		flex-direction: column;
		text-align: start;
		gap: 5px;

		.subject-info {
			display: flex;
			flex-direction: column;
			gap: 4px;
		}

		.summary {
			font-weight: bold;
			font-size: 14px;
		}
	}
</style>

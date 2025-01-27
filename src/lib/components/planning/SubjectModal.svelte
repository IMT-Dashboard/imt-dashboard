<script lang="ts">
	import { formatHours, transformTextInColor } from '$lib/server/miscellaneous.utils';
	import type { Subject } from '$lib/models/schedule.model';
	import Modal from '$lib/components/Modal.svelte';

	export let showModal: boolean;
	export let subject: Subject;
</script>

<!--INVESTIGATE-->

<Modal bind:showModal>
	{#snippet header()}
		<div class="header">
			<div class="bar" style={'background-color: ' + transformTextInColor(subject.summary)}></div>
			<h2 class="modal-summary-text">{subject.summary}</h2>
		</div>
	{/snippet}
	<div class="modal-box">
		<p>{formatHours(subject.start)} - {formatHours(subject.end)}</p>
		<p>Salle : {subject.location}</p>
	</div>
	<div class="description">
		<p>{subject.description}</p>
	</div>

	<style>
		.header {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 15px;

			.bar {
				min-width: 6px;
				border-radius: 4px;
				margin-right: 10px;
				height: 40px;
			}

			.modal-summary-text {
				font-size: 20px;
			}
		}

		.modal-box {
			display: flex;
			flex-direction: column;
			gap: 10px;
			margin-bottom: 20px;
		}

		.description {
			max-height: 50vh;
			overflow-y: auto;

			p {
				font-weight: 500;
			}
		}
	</style>
</Modal>

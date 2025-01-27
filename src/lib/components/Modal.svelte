<script lang="ts">
	const { showModal, header, children } = $props<{ showModal: boolean }>();

	let dialog: HTMLDialogElement;

	$effect(() => {
		if (dialog && showModal) {
			document.body.classList.add('no-scroll');
			dialog.showModal();
		}
	});

	function close() {
		document.body.classList.remove('no-scroll');
	}
</script>

<dialog
	bind:this={dialog}
	onclick={() => {
		dialog.close();
	}}
	onclose={() => {
		close();
	}}
	style="width:40%"
>
	<div onclick={(event) => event.stopPropagation()}>
		{#if header}
			{@render header()}
		{/if}
		{@render children()}
	</div>
</dialog>

<style>
	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(2px);
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		background: var(--theme-background);
		width: 85%;
		display: flex;
		justify-content: center;
		border: none;
		border-radius: 20px;
		min-height: 250px;
	}

	@media (min-width: 768px) {
		dialog[open] {
			width: 60%;
		}
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>

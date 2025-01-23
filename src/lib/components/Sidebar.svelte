<script lang="ts">
	let semesters: string[] = [];

	function getPreviousSemesters() {}

	function setSemester() {}
</script>

<div class="sidebar-container">
	<div class="sidebar-content">
		<div class="sidebar-title">
			<img src="/logo.svg" alt="IMT" />
			<h1>Dashboard</h1>
		</div>
		<div>
			<h2>Notes</h2>
			<h2>Planning</h2>
			<h2>Documents</h2>
			<h2>Paramètres</h2>
		</div>
	</div>
</div>

<style>
	.sidebar-container {
		position: sticky;
		height: 100vh;
		width: 200px;
		background-color: var(--background);
	}

	.sidebar-content {
		margin: auto;
		width: 80%;
	}

	.sidebar-title {
		padding-top: 1rem;
		justify-items: center;
		align-items: center;
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
	}

	h1 {
		font-size: 1.2rem;
		color: var(--text);
	}

	h2 {
		opacity: 70%;
		font-size: 1rem;
		font-weight: normal;
		color: var(--text);
	}

	img {
		width: 36px;
		height: 36px;
	}
</style>

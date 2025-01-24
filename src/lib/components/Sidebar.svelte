<script lang="ts">
	import { CurrentSemester, type Promotion, Semester } from '$lib/data/semester';
	import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
	import Fa from 'svelte-fa';
	import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
	import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen';

	let promotion: Promotion = 'infres16'; // TODO: Do not use hardcoded value

	let semesters: number[] = getPreviousSemesters();
	let selected = $state(CurrentSemester[promotion]);

	function getPreviousSemesters() {
		const semestersForPromotion = Object.keys(Semester[promotion])
			.map((element) => parseInt(element))
			.sort((a, b) => a - b);
		const currentSemester = CurrentSemester[promotion];
		return semestersForPromotion.filter((semester) => semester <= currentSemester);
	}
</script>

<div class="sidebar-container">
	<div class="sidebar-content">
		<div class="sidebar-title">
			<img src="/logo.svg" alt="IMT" />
			<h1>Dashboard</h1>
		</div>
		<div>
			<select id="semester" name="semester" bind:value={selected}>
				{#each semesters as semester}
					<option value={semester}>Semestre {semester}</option>
				{/each}
			</select>
			<a class="link" href="/planning">
				<Fa icon={faCalendar} class="icon" />
				Planning
			</a>
			<a class="link" href="/documents">
				<Fa icon={faFolderOpen} class="icon" />
				Documents
			</a>
			<a class="link" href="/settings">
				<Fa icon={faGear} class="icon" />
				Paramètres
			</a>
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

	.icon {
		margin-right: 1rem;
		width: 1rem;
	}

	.link {
		display: inline-block;
		color: var(--text);
		font-size: 1rem;
		font-weight: normal;
		text-decoration: none;
	}

	h1 {
		font-size: 1.2rem;
		color: var(--text);
	}

	img {
		width: 36px;
		height: 36px;
	}
</style>

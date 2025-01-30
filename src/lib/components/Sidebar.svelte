<script lang="ts">
	import { CurrentSemester, type Promotion, Semester } from '$lib/data/semester';
	import { faGear } from '@fortawesome/free-solid-svg-icons/faGear';
	import Fa from 'svelte-fa';
	import { faCalendar } from '@fortawesome/free-solid-svg-icons/faCalendar';
	import { faFolderOpen } from '@fortawesome/free-solid-svg-icons/faFolderOpen';
	import {onMount} from "svelte";
	import {currentSemester} from "../../stores/current-semester.store";
	import {getPreviousSemesters, getUserFromJwt} from "$lib/utils";
	import {faStar} from "@fortawesome/free-solid-svg-icons";

    let promotion: Promotion;
    let semesters: number[] = $state([]);

    let selected = $state(CurrentSemester["infres16"]);

    onMount(async () => {
        const user = await getUserFromJwt();
        promotion = user.promotion;
        semesters = getPreviousSemesters(promotion);
        selected = CurrentSemester[promotion];
    })

    $effect(() => {
        currentSemester.set(selected);
    });
</script>

<div class="sidebar-container">
	<div class="sidebar-content">
		<div class="sidebar-title">
			<img src="/logo.svg" alt="IMT" />
			<h1>Dashboard</h1>
		</div>
		<div class="sidebar-items">
			<select id="semester" name="semester" bind:value={selected}>
				{#each semesters as semester}
					<option value={semester}>Semestre {semester}</option>
				{/each}
			</select>
			<a class="link" href="/">
				<Fa icon={faStar} class="icon" />
				Notes
			</a>
			<a class="link" href="/planning">
				<Fa icon={faCalendar} class="icon" />
				Planning
			</a>
			<!--			<a class="link" href="/documents">-->
			<a class="link">
				<Fa icon={faFolderOpen} class="icon" />
				Documents
			</a>
			<!--			<a class="link" href="/settings">-->
			<a class="link">
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
		margin-bottom: 2rem;
	}

	.sidebar-items {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.link {
		display: inline-block;
		color: var(--text);
		font-size: 1rem;
		font-weight: normal;
		text-decoration: none;
	}

	.link:hover {
		color: var(--primary);
	}

	select {
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--text);
		background-color: var(--background);
		color: var(--text);
	}

	h1 {
		font-size: 1.2rem;
		color: var(--text);
		margin-bottom: 0;
	}

	img {
		width: 36px;
		height: 36px;
	}
</style>

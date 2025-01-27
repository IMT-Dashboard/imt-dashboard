<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Feedback } from '$lib/models/feedback.model';
	import CircleLoader from '$lib/components/CircleLoader.svelte';

	let feedback: Feedback | null = $state(null);
	let username = $state('');
	let password = $state('');
	let keepSignIn = $state(false);
	let isConnecting = $state(false);

	$effect(() => {
		const keepConnected = localStorage.getItem('keepConnected');
		if (keepConnected) {
			const { username, encryptedPassword } = JSON.parse(keepConnected);
			login(username, encryptedPassword, true);
			planningLogin(username, encryptedPassword, true);
		}
	});

	async function handleSubmit(event: Event) {
		event.preventDefault();
		isConnecting = true;
		feedback = null;

		await login(username, password);
		planningLogin(username, password);
	}

	async function planningLogin(username: string, password: string, isEncrypted = false) {
		const formData = new FormData();
		formData.append('username', username);
		formData.append(isEncrypted ? 'encryptedPassword' : 'password', password);

		try {
			const response = await fetch('/api/authentication/planning/login', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				localStorage.removeItem('keepConnected');
				feedback = {
					type: 'error',
					message: 'Une erreur est survenue lors de la connexion au planning'
				};
			}
		} catch (err: any) {
			console.error(err);
			feedback = {
				type: 'error',
				message: 'Une erreur serveur est survenue'
			};
		} finally {
			isConnecting = false;
		}
	}

	async function login(username: string, password: string, isEncrypted = false) {
		const formData = new FormData();
		formData.append('username', username);
		formData.append(isEncrypted ? 'encryptedPassword' : 'password', password);

		try {
			const response = await fetch('/api/authentication/login', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				if (keepSignIn) {
					const data = await response.json();
					localStorage.setItem(
						'keepConnected',
						JSON.stringify({
							encryptedPassword: data.encryptedPassword,
							username: username
						})
					);
				}
				await goto('/');
			} else {
				localStorage.removeItem('keepConnected');
				feedback = {
					type: 'error',
					message: 'Une erreur est survenue lors de la connexion'
				};
			}
		} catch (err: any) {
			console.error(err);
			feedback = {
				type: 'error',
				message: 'Une erreur serveur est survenue'
			};
		} finally {
			isConnecting = false;
		}
	}
</script>

<div class="login-page">
	<form onsubmit={handleSubmit}>
		<h2>Connexion</h2>
		<div class="label-input">
			<label for="username">Nom d'utilisateur</label>
			<input bind:value={username} id="username" name="username" placeholder="prenom.nom" required type="text" />
		</div>
		<div class="label-input">
			<label for="password">Mot de passe</label>
			<input bind:value={password} id="password" name="password" required type="password" />
		</div>
		<div class="keep-signin">
			<label for="stayConnected">Rester connecté</label>
			<input bind:checked={keepSignIn} type="checkbox" id="stayConnected" name="stayConnected" />
		</div>

		<div class="error-box">
			{#if feedback && feedback.type === 'error'}
				<p class="error">{feedback.message}</p>
			{/if}
		</div>

		<button class="submit" disabled={isConnecting || !username || !password} type="submit">
			{#if isConnecting}
				<CircleLoader />
				Connexion...
			{:else}
				Se connecter
			{/if}
		</button>
	</form>
</div>

<style>
	.login-page {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		width: 300px;
		background-color: var(--secondary);
		padding: 2.5rem;
		gap: 15px;
		border-radius: 1rem;
	}

	.label-input {
		display: flex;
		flex-direction: column;
		color: var(--text);
	}

	.submit {
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background-color 0.2s ease-in-out;
		gap: 10px;
	}

	.error-box {
		height: 20px;
	}

	.error {
		color: var(--error);
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
	}
</style>

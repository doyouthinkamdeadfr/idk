<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state('');
	let success = $state('');
	let loading = $state(false);

	async function handleSignup() {
		loading = true;
		error = '';
		success = '';
		const { error: err } = await authClient.signUp.email({
			email,
			password,
			name
		});
		if (err) {
			error = err.message ?? '';
		} else {
			window.location.href = '/dashboard';
		}
		loading = false;
	}

	const providers = [
		{ id: 'discord', label: 'Discord', icon: 'D' },
		{ id: 'github', label: 'GitHub', icon: 'G' }
	] as const;

	async function handleOAuth(provider: string) {
		loading = true;
		error = '';
		const { error: err } = await authClient.signIn.social({
			provider,
			callbackURL: '/dashboard'
		});
		if (err) {
			error = err.message ?? '';
			loading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-bg-primary px-6">
	<div class="w-full max-w-sm">
		<a href="/" class="mb-8 block text-center text-2xl font-bold tracking-tight text-text-primary"
			>Memory</a
		>

		{#if error}
			<div class="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
		{/if}
		{#if success}
			<div class="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600">{success}</div>
		{/if}

		<form
			onsubmit={(e) => {
				e.preventDefault();
				handleSignup();
			}}
			class="space-y-4"
		>
			<div>
				<label for="name" class="text-xs font-semibold tracking-widest text-text-muted uppercase"
					>Name</label
				>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					class="mt-1 w-full rounded-lg border border-border-subtle bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
					placeholder="Your name"
				/>
			</div>
			<div>
				<label for="email" class="text-xs font-semibold tracking-widest text-text-muted uppercase"
					>Email</label
				>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					class="mt-1 w-full rounded-lg border border-border-subtle bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
					placeholder="you@example.com"
				/>
			</div>
			<div>
				<label
					for="password"
					class="text-xs font-semibold tracking-widest text-text-muted uppercase">Password</label
				>
				<input
					id="password"
					type="password"
					bind:value={password}
					required
					class="mt-1 w-full rounded-lg border border-border-subtle bg-white px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
					placeholder="••••••••"
				/>
			</div>
			<button
				type="submit"
				disabled={loading}
				class="w-full rounded-full bg-accent-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-primary/90 active:scale-95 disabled:opacity-50"
			>
				{loading ? 'Creating account...' : 'Create account'}
			</button>
		</form>

		<div class="my-6 flex items-center gap-3">
			<div class="h-px flex-1 bg-border-subtle"></div>
			<span class="text-xs text-text-muted">or continue with</span>
			<div class="h-px flex-1 bg-border-subtle"></div>
		</div>

		<div class="flex flex-col gap-3">
			{#each providers as { id, label, icon }}
				<button
					onclick={() => handleOAuth(id)}
					disabled={loading}
					class="flex items-center justify-center gap-2 rounded-full border border-border-subtle px-5 py-2.5 text-sm font-medium text-text-primary transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95 disabled:opacity-50"
				>
					<span
						class="flex h-5 w-5 items-center justify-center rounded bg-accent-primary/10 text-xs font-bold text-accent-primary"
						>{icon}</span
					>
					{label}
				</button>
			{/each}
		</div>

		<p class="mt-8 text-center text-sm text-text-muted">
			Already have an account?
			<a href="/login" class="font-semibold text-accent-primary hover:underline">Sign in</a>
		</p>
	</div>
</div>

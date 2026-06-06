<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import { onMount } from 'svelte';

	let user = $derived($page.data.session?.user);
	let customerState = $state<any>(null);
	let loading = $state(true);

	onMount(async () => {
		const { data } = await authClient.customer.state();
		customerState = data;
		loading = false;
	});

	const isPro = $derived(
		customerState?.activeSubscriptions?.some((s: any) => s.status === 'active') ?? false
	);

	async function handleUpgrade() {
		try {
			await authClient.checkout({ slug: 'pro-monthly' });
		} catch (e) {
			console.error('Checkout failed:', e);
			alert('Checkout failed. Please try again.');
		}
	}

	async function handlePortal() {
		try {
			await authClient.customer.portal();
		} catch (e) {
			console.error('Portal failed:', e);
			alert('Failed to open portal. Please try again.');
		}
	}

	async function handleLogout() {
		await authClient.signOut();
		window.location.href = '/';
	}
</script>

<div class="mx-auto max-w-2xl px-6 py-8">
	<h1 class="text-2xl font-bold text-text-primary">Settings</h1>

	<div class="mt-8 space-y-8">
		<div class="rounded-2xl border border-border-subtle bg-white p-6">
			<h2 class="text-base font-semibold text-text-primary">Profile</h2>
			<div class="mt-4 space-y-4">
				<div>
					<label class="text-xs font-semibold tracking-wider text-text-muted uppercase">Name</label>
					<p class="mt-1 text-sm text-text-primary">{user?.name || '—'}</p>
				</div>
				<div>
					<label class="text-xs font-semibold tracking-wider text-text-muted uppercase">Email</label
					>
					<p class="mt-1 text-sm text-text-primary">{user?.email || '—'}</p>
				</div>
			</div>
		</div>

		<div class="rounded-2xl border border-border-subtle bg-white p-6">
			<h2 class="text-base font-semibold text-text-primary">Plan</h2>
			<div class="mt-4">
				{#if loading}
					<p class="text-sm text-text-muted">Loading plan...</p>
				{:else}
					<div class="flex items-center gap-3">
						<span
							class="rounded-full {isPro
								? 'bg-accent-secondary/10 text-accent-secondary'
								: 'bg-text-muted/10 text-text-muted'} px-3 py-1 text-xs font-semibold"
						>
							{isPro ? 'Pro' : 'Free'}
						</span>
						{#if isPro}
							<button onclick={handlePortal} class="text-sm text-accent-primary hover:underline"
								>Manage subscription</button
							>
						{:else}
							<button
								onclick={handleUpgrade}
								class="rounded-full bg-accent-primary px-5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-accent-primary/90 active:scale-95"
							>
								Upgrade to Pro
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>

		<div class="rounded-2xl border border-border-subtle bg-white p-6">
			<h2 class="text-base font-semibold text-text-primary">Account</h2>
			<div class="mt-4">
				<button onclick={handleLogout} class="text-sm text-red-500 hover:underline">
					Sign out
				</button>
			</div>
		</div>
	</div>
</div>

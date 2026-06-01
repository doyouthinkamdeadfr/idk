<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import { onMount } from 'svelte';

	let customerState = $state<any>(null);
	let loading = $state(true);

	onMount(async () => {
		const { data } = await authClient.customer.state();
		customerState = data;
		loading = false;
	});

	const isPro = $derived(customerState?.subscriptions?.some((s: any) => s.status === 'active') ?? false);

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

<div class="flex min-h-screen flex-col items-center justify-center bg-bg-primary px-6">
	<div class="w-full max-w-md text-center">
		<h1 class="text-3xl font-bold tracking-tight text-text-primary">Welcome to Memory</h1>
		<p class="mt-3 text-base text-text-muted">
			Logged in as <span class="font-semibold text-accent-primary">{$page.data.session?.user?.email ?? 'unknown'}</span>
		</p>

		<div class="mt-8 rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
			{#if loading}
				<p class="text-sm text-text-muted">Loading your plan...</p>
			{:else if isPro}
				<div class="mb-4 inline-block rounded-full bg-accent-secondary/10 px-4 py-1 text-sm font-medium text-accent-secondary">
					Pro Plan
				</div>
				<p class="text-sm text-text-muted">You have access to all Pro features.</p>
			{:else}
				<div class="mb-4 inline-block rounded-full bg-text-muted/10 px-4 py-1 text-sm font-medium text-text-muted">
					Free Plan
				</div>
				<p class="text-sm text-text-muted">Upgrade to Pro for advanced retrieval, unlimited queries, and priority support.</p>
			{/if}
		</div>

		<div class="mt-4 flex flex-col items-center gap-3">
			{#if isPro}
				<button
					onclick={handlePortal}
					class="inline-block rounded-full bg-accent-primary px-8 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
				>
					Manage Subscription
				</button>
			{:else if !loading}
				<button
					onclick={handleUpgrade}
					class="inline-block rounded-full bg-accent-primary px-8 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
				>
					Upgrade to Pro
				</button>
			{/if}

			<button
				onclick={handleLogout}
				class="inline-block rounded-full border border-border-subtle px-6 py-2.5 text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
			>
				Sign out
			</button>
		</div>
	</div>
</div>

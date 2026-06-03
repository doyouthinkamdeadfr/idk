<script lang="ts">
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import { onMount } from 'svelte';

	let planOpen = $state(false);
	let user = $derived($page.data.session?.user);
	let isPro = $state(false);

	onMount(async () => {
		try {
			const { data } = await authClient.customer.state();
			isPro = data?.subscriptions?.some((s: any) => s.status === 'active') ?? false;
		} catch {}
	});

	function togglePlan(e: MouseEvent) {
		e.stopPropagation();
		planOpen = !planOpen;
	}

	function closePlan() {
		planOpen = false;
	}

	function handleNewChat() {
		window.location.href = '/dashboard';
	}
</script>

<svelte:window onclick={closePlan} />

<header class="flex h-14 items-center justify-between border-b border-border-subtle bg-white px-6">
	<div class="relative">
		<button
			onclick={togglePlan}
			class="flex items-center gap-1.5 text-lg font-bold tracking-tight text-text-primary hover:text-accent-primary transition-colors"
		>
			Memory
			<svg class="h-4 w-4 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
		{#if planOpen}
			<div class="absolute top-full left-0 mt-2 w-56 rounded-xl border border-border-subtle bg-white p-4 shadow-lg" onclick={(e) => e.stopPropagation()}>
				<p class="text-xs font-semibold tracking-wider text-text-muted uppercase">Current Plan</p>
				<div class="mt-2 flex items-center gap-2">
					<span class="rounded-full {isPro ? 'bg-accent-secondary/10 text-accent-secondary' : 'bg-text-muted/10 text-text-muted'} px-2.5 py-0.5 text-xs font-semibold">
						{isPro ? 'Pro' : 'Free'}
					</span>
				</div>
				<div class="mt-3 border-t border-border-subtle pt-3">
					{#if isPro}
						<a href="/dashboard/settings" class="block text-sm text-accent-primary hover:underline">Manage plan →</a>
					{:else}
						<a href="/pricing" class="block text-sm text-accent-primary hover:underline">View plans →</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<div class="flex items-center gap-3">
		<a
			href="/pricing"
			class="rounded-full bg-accent-primary px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-accent-primary/90 active:scale-95"
		>
			Upgrade
		</a>
		<button
			onclick={handleNewChat}
			class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-accent-primary hover:bg-bg-primary transition-all"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</button>
	</div>
</header>

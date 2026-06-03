<script lang="ts">
	import { page } from '$app/stores';

	let planOpen = $state(false);
	let user = $derived($page.data.session?.user);
	let isPro = $state(false);

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
				<p class="mt-1 text-sm font-semibold text-text-primary">{isPro ? 'Pro' : 'Free'}</p>
				<div class="mt-3 border-t border-border-subtle pt-3">
					<a href="/dashboard/settings" class="block text-sm text-accent-primary hover:underline">Manage plan →</a>
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
			class="flex items-center gap-1.5 rounded-full border border-border-subtle px-4 py-1.5 text-xs font-semibold text-text-primary transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
		>
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
			New Chat
		</button>
	</div>
</header>

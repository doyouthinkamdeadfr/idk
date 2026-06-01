<script lang="ts">
	import { scrollY } from '$lib/scroll';
	import { page } from '$app/stores';

	let scrolled = $state(false);

	scrollY.subscribe((y) => {
		scrolled = y > 40;
	});

	let session = $derived($page.data.session?.session);
	let user = $derived($page.data.session?.user);
</script>

<nav
	class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-10 {scrolled
		? 'bg-white/80 shadow-sm backdrop-blur-xl'
		: 'bg-transparent'}"
>
	<a href="/" class="text-lg font-bold tracking-tight text-text-primary"> Memory </a>

	<div class="flex items-center gap-6">
		{#if user}
			<a
				href="/dashboard"
				class="text-sm text-text-muted transition-colors hover:text-accent-primary"
			>
				Dashboard
			</a>
			<a
				href="/pricing"
				class="text-sm text-text-muted transition-colors hover:text-accent-primary"
			>
				Pricing
			</a>
			<a
				href="/auth/logout"
				class="rounded-full border border-border-subtle px-5 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
			>
				Sign out
			</a>
		{:else}
			<a
				href="#how-it-works"
				class="hidden text-sm text-text-muted transition-colors hover:text-accent-primary md:block"
				>How it works</a
			>
			<a
				href="#benchmarks"
				class="hidden text-sm text-text-muted transition-colors hover:text-accent-primary md:block"
				>Benchmarks</a
			>
			<a
				href="/pricing"
				class="text-sm text-text-muted transition-colors hover:text-accent-primary"
				>Pricing</a
			>
			<a
				href="/login"
				class="rounded-full border border-border-subtle px-5 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
			>
				Sign in
			</a>
			<a
				href="/signup"
				class="rounded-full bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-primary/90 active:scale-95"
			>
				Get Started
			</a>
		{/if}
	</div>
</nav>

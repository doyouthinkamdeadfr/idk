<script lang="ts">
	import { scrollY } from '$lib/scroll';

	let scrolled = $state(false);

	scrollY.subscribe((y) => {
		scrolled = y > 40;
	});
</script>

<nav
	class="fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4 transition-all duration-300 md:px-10 {scrolled
		? 'bg-white/80 shadow-sm backdrop-blur-xl'
		: 'bg-transparent'}"
>
	<a href="/" class="text-lg font-bold tracking-tight text-text-primary"> supermemory </a>

	<div class="flex items-center gap-6">
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
			href="#pricing"
			class="hidden text-sm text-text-muted transition-colors hover:text-accent-primary md:block"
			>Pricing</a
		>
		<a
			href="#cta"
			class="rounded-full bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-primary/90 active:scale-95"
		>
			Get Early Access
		</a>
	</div>
</nav>

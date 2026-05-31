<script lang="ts">
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import Reveal from '$components/ui/Reveal.svelte';
	import TiltCard from '$components/ui/TiltCard.svelte';

	let { sectionProgress = 0 } = $props();

	let started = $state(false);

	const traditional = tweened(0, { duration: 1200, easing: cubicOut });
	const memoryRag = tweened(0, { duration: 1200, easing: cubicOut });

	$effect(() => {
		if (!started && sectionProgress > 0.4) {
			started = true;
			$traditional = 2300;
			$memoryRag = 47;
		}
	});
</script>

<section
	id="benchmarks"
	class="relative flex min-h-screen w-full items-center bg-accent-primary/5 px-8 md:px-16"
>
	<div class="mx-auto w-full max-w-4xl">
		<Reveal progress={sectionProgress}>
			<div class="text-center">
				<p class="text-xs font-semibold tracking-[0.2em] text-accent-primary uppercase">
					Speed Benchmarks
				</p>
				<h2 class="mt-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
					<span class="text-accent-primary">47ms</span> vs 2.3s
				</h2>
			</div>
		</Reveal>

		<Reveal progress={sectionProgress} stagger={0.08}>
			<div class="mt-16 grid gap-12 md:grid-cols-2">
				<TiltCard glowColor="136, 133, 124">
					<div class="rounded-2xl bg-white p-10 shadow-sm transition-shadow duration-300">
						<div class="text-sm font-semibold tracking-[0.1em] text-text-muted uppercase">
							Traditional Search
						</div>
						<div class="mt-2 text-6xl font-bold text-text-muted/40 md:text-7xl">
							{($traditional / 1000).toFixed(1)}<span class="text-3xl md:text-4xl">s</span>
						</div>
						<div class="mt-6 h-2 w-full overflow-hidden rounded-full bg-border-subtle">
							<div
								class="h-full rounded-full bg-text-muted/30 transition-all duration-100"
								style="width: {Math.min(($traditional / 3000) * 100, 100)}%"
							></div>
						</div>
					</div>
				</TiltCard>

				<TiltCard glowColor="232, 99, 74">
					<div
						class="rounded-2xl bg-white p-10 shadow-md shadow-accent-primary/10 transition-shadow duration-300"
					>
						<div class="text-sm font-semibold tracking-[0.1em] text-accent-primary uppercase">
							Memory RAG
						</div>
						<div class="mt-2 text-6xl font-bold text-accent-primary md:text-7xl">
							{$memoryRag}<span class="text-3xl md:text-4xl">ms</span>
						</div>
						<div class="mt-6 h-2 w-full overflow-hidden rounded-full bg-border-subtle">
							<div
								class="h-full rounded-full bg-accent-primary transition-all duration-100"
								style="width: {Math.min($memoryRag / 200, 100)}%"
							></div>
						</div>
					</div>
				</TiltCard>
			</div>
		</Reveal>

		<Reveal progress={sectionProgress} stagger={0.16}>
			<div class="mx-auto mt-8 max-w-xs rounded-full bg-accent-primary/10 px-8 py-4 text-center">
				<span class="text-lg font-bold text-accent-primary">
					{$traditional > 0 && $memoryRag > 0 ? Math.round($traditional / $memoryRag) : 0}x
					faster
				</span>
			</div>
		</Reveal>
	</div>
</section>

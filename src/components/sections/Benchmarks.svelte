<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let el: HTMLDivElement;
	let started = $state(false);

	const traditional = tweened(0, { duration: 1200, easing: cubicOut });
	const supermemory = tweened(0, { duration: 1200, easing: cubicOut });

	onMount(() => {
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started) {
					started = true;
					$traditional = 2300;
					$supermemory = 47;
					obs.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	});
</script>

<section id="benchmarks" class="relative w-full bg-accent-primary/5 px-6 py-28 md:px-10 md:py-36">
	<div class="mx-auto max-w-6xl">
		<Reveal>
			<div class="text-center">
				<span class="text-xs font-semibold tracking-[0.2em] text-accent-primary uppercase"
					>Speed Benchmarks</span
				>
				<h2 class="mt-3 text-3xl leading-tight font-bold md:text-4xl">
					<span class="text-accent-primary">47 milliseconds</span> vs minutes
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-base text-text-muted">
					Real-world retrieval performance across 50,000+ document knowledge bases.
				</p>
			</div>

			<div bind:this={el} class="mx-auto mt-16 max-w-2xl space-y-8">
				<div>
					<div class="flex items-center justify-between text-sm">
						<span class="font-semibold text-text-muted">Traditional keyword search</span>
						<span class="font-mono text-lg text-text-muted">
							{($traditional / 1000).toFixed(1)}s
						</span>
					</div>
					<div class="mt-2 h-4 w-full overflow-hidden rounded-full bg-border-subtle">
						<div
							class="h-full rounded-full bg-text-muted/40 transition-all duration-100"
							style="width: {Math.min(($traditional / 3000) * 100, 100)}%"
						></div>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between text-sm">
						<span class="font-semibold text-accent-primary">Supermemory RAG</span>
						<span class="font-mono text-lg font-bold text-accent-primary">
							{$supermemory}ms
						</span>
					</div>
					<div class="mt-2 h-4 w-full overflow-hidden rounded-full bg-border-subtle">
						<div
							class="h-full rounded-full bg-accent-primary transition-all duration-100"
							style="width: {Math.min($supermemory / 200, 100)}%"
						></div>
					</div>
				</div>

				<div class="rounded-xl border border-accent-primary/20 bg-accent-primary/5 p-6 text-center">
					<div class="text-2xl font-bold text-accent-primary">
						{$traditional > 0 && $supermemory > 0 ? Math.round($traditional / $supermemory) : 0}x
					</div>
					<p class="mt-1 text-sm text-text-muted">Faster than traditional search</p>
				</div>
			</div>
		</Reveal>
	</div>
</section>

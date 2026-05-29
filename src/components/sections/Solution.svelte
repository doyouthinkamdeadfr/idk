<script lang="ts">
	import Counter from '$components/ui/Counter.svelte';
	import Reveal from '$components/ui/Reveal.svelte';

	let { sectionProgress = 0 } = $props();
</script>

<section class="relative flex min-h-screen w-full items-center overflow-hidden bg-accent-primary/5 px-8 md:px-16">
	<div class="pointer-events-none absolute inset-0" aria-hidden="true">
		<div class="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-accent-secondary/5 blur-3xl"></div>
		<div class="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-accent-primary/5 blur-3xl"></div>
	</div>

	<div class="relative mx-auto w-full max-w-6xl text-center">
		<Reveal progress={sectionProgress}>
			<div>
				<p class="text-xs font-semibold tracking-[0.2em] text-accent-primary uppercase">
					The Solution
				</p>
				<h2 class="mt-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
					Ask. Retrieve. Answer.<br />
					<span class="text-accent-primary">In milliseconds.</span>
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-base text-text-muted">
					Connect your knowledge sources once. Ask in plain English. Get instant answers with
					citations.
				</p>
			</div>
		</Reveal>

		<Reveal progress={sectionProgress} stagger={0.1}>
			<div class="mt-16 grid gap-6 sm:grid-cols-3">
				<div
					class="rounded-2xl bg-white/60 p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-md"
				>
					<div class="text-6xl font-bold text-accent-primary md:text-7xl">
						<Counter value={50000} suffix="+" />
					</div>
					<p class="mt-2 text-sm text-text-muted">Documents indexed</p>
				</div>
				<div
					class="rounded-2xl bg-white/60 p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-md"
				>
					<div class="text-6xl font-bold text-accent-secondary md:text-7xl">
						<Counter value={997} prefix="" suffix="%" />
					</div>
					<p class="mt-2 text-sm text-text-muted">Retrieval accuracy</p>
				</div>
				<div
					class="rounded-2xl bg-white/60 p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-md"
				>
					<div class="text-6xl font-bold text-accent-primary md:text-7xl">
						<Counter value={2000000} suffix="+" duration={2000} />
					</div>
					<p class="mt-2 text-sm text-text-muted">Queries answered</p>
				</div>
			</div>
		</Reveal>
	</div>
</section>

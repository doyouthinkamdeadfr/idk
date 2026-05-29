<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';

	let { sectionProgress = 0 } = $props();
</script>

<section
	id="cta"
	class="relative flex min-h-screen w-full items-center overflow-hidden bg-gradient-to-br from-accent-primary/10 via-accent-warm/10 to-accent-secondary/10 px-8 md:px-16"
>
	<div class="mx-auto w-full max-w-3xl text-center">
		<Reveal progress={sectionProgress}>
			<h2 class="text-5xl leading-tight font-bold md:text-6xl lg:text-7xl">
				Ready to get answers<br />
				<span class="text-accent-primary">in milliseconds?</span>
			</h2>
		</Reveal>
		<Reveal progress={sectionProgress} stagger={0.08}>
			<p class="mx-auto mt-6 max-w-lg text-base leading-relaxed text-text-muted md:text-lg">
				Join thousands of teams using Supermemory to retrieve, augment, and generate insights from
				their data.
			</p>
		</Reveal>
		<Reveal progress={sectionProgress} stagger={0.14}>
			<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
				<button
					class="group relative inline-block rounded-full bg-accent-primary px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-primary/20 transition-all duration-200 hover:bg-accent-primary/90 hover:shadow-xl hover:shadow-accent-primary/30 active:scale-95"
				>
					<span class="relative z-10">Start Free Trial</span>
					<span
						class="absolute inset-0 rounded-full bg-accent-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
						style="filter: blur(12px);"
					></span>
				</button>
				<button
					class="group relative inline-block rounded-full bg-accent-primary px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-primary/20 transition-all duration-200 hover:bg-accent-primary/90 hover:shadow-xl hover:shadow-accent-primary/30 active:scale-95"
				>
					<span class="relative z-10">Start Free Trial</span>
					<span
						class="absolute inset-0 rounded-full bg-accent-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
						style="filter: blur(12px);"
					></span>
				</button>
				<button
					class="inline-block rounded-full border border-text-muted/30 px-10 py-3.5 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
				>
					Talk to Sales
				</button>
			</div>
		</Reveal>
	</div>
</section>

<script lang="ts">
	import { onMount } from 'svelte';
	import Reveal from '$components/ui/Reveal.svelte';

	let { sectionProgress = 0 } = $props();

	let steps = [
		{
			number: '01',
			title: 'Connect',
			desc: 'Link your documents, databases, and repos. One integration.'
		},
		{
			number: '02',
			title: 'Retrieve',
			desc: 'Ask in natural language. Semantic search across every source.'
		},
		{ number: '03', title: 'Answer', desc: 'Get a grounded answer with citations in milliseconds.' }
	];

	let activeStep = $state(-1);
	let stepEls: HTMLElement[] = [];

	onMount(() => {
		const obs = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const idx = Number(entry.target.getAttribute('data-step'));
						if (idx > activeStep) activeStep = idx;
					}
				}
			},
			{ threshold: 0.4 }
		);
		for (const el of stepEls) {
			if (el) obs.observe(el);
		}
		return () => obs.disconnect();
	});
</script>

<section
	id="how-it-works"
	class="relative flex min-h-screen w-full items-center bg-bg-primary px-8 md:px-16"
>
	<div class="mx-auto w-full max-w-6xl">
		<Reveal progress={sectionProgress}>
			<div class="text-center">
				<p class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">How It Works</p>
				<h2 class="mt-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
					Three steps to instant answers
				</h2>
			</div>
		</Reveal>

		<Reveal progress={sectionProgress} stagger={0.08}>
			<div class="mt-16 grid gap-0 md:grid-cols-3">
				{#each steps as step, i}
					<div
						bind:this={stepEls[i]}
						data-step={i}
						class="relative p-8 transition-all duration-500 md:p-12"
					>
						<div
							class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold transition-all duration-500 {activeStep >=
							i
								? 'bg-accent-primary text-white'
								: 'bg-text-muted/10 text-text-muted'}"
						>
							{step.number}
						</div>
						<h3 class="text-2xl font-semibold">{step.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-text-muted">{step.desc}</p>

						{#if i < steps.length - 1}
							<div
								class="absolute top-1/2 right-0 hidden h-px w-8 -translate-y-1/2 bg-border-subtle md:block"
							></div>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mx-auto mt-4 flex h-1 w-full max-w-md items-center gap-2">
				{#each steps as _, i}
					<div
						class="h-1 flex-1 rounded-full transition-all duration-500 {activeStep >= i
							? 'bg-accent-primary'
							: 'bg-border-subtle'}"
					></div>
				{/each}
			</div>
		</Reveal>
	</div>
</section>

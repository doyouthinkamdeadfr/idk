<script lang="ts">
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

	let activeStep = $derived.by(() => {
		const raw = (sectionProgress - 0.05) / 0.3;
		return Math.max(-1, Math.min(2, Math.floor(raw)));
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
						data-step={i}
						class="relative p-8 transition-all duration-500 md:p-12"
					>
						<div
							class="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold transition-all duration-500 {activeStep >=
							i
								? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30'
								: 'bg-text-muted/10 text-text-muted'}"
						>
							{step.number}
						</div>
						<h3 class="text-2xl font-semibold">{step.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-text-muted">{step.desc}</p>

						{#if i < steps.length - 1}
							<div
								class="absolute top-1/2 right-0 hidden h-0.5 w-8 -translate-y-1/2 transition-all duration-500 md:block {activeStep >= i
									? 'bg-accent-primary'
									: 'bg-border-subtle'}"
							></div>
						{/if}
					</div>
				{/each}
			</div>

			<div class="mx-auto mt-4 flex h-1.5 w-full max-w-md items-center gap-2 rounded-full bg-border-subtle p-0.5">
				{#each steps as _, i}
					<div
						class="h-full flex-1 rounded-full transition-all duration-500 {activeStep >= i
							? 'bg-accent-primary'
							: 'bg-transparent'}"
					></div>
				{/each}
			</div>
		</Reveal>
	</div>
</section>

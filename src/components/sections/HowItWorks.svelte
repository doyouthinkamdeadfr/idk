<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';
	import { onMount } from 'svelte';

	let steps = [
		{
			number: '01',
			title: 'Connect',
			desc: 'Link your documents, databases, code repos, and wiki. One integration, all your knowledge.',
			icon: '🔗'
		},
		{
			number: '02',
			title: 'Retrieve',
			desc: 'Ask in natural language. Supermemory instantly searches across every source with semantic understanding.',
			icon: '⚡'
		},
		{
			number: '03',
			title: 'Answer',
			desc: 'Get a coherent answer grounded in your data — with citations you can verify in one click.',
			icon: '✅'
		}
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

<section id="how-it-works" class="relative w-full px-6 py-28 md:px-10 md:py-36">
	<div class="mx-auto max-w-6xl">
		<Reveal>
			<div class="text-center">
				<span class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase"
					>How It Works</span
				>
				<h2 class="mt-3 text-3xl leading-tight font-bold md:text-4xl">
					Three steps to instant answers
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-base text-text-muted">
					No configuration. No training. Just connect and ask.
				</p>
			</div>

			<div class="mt-16 grid gap-8 md:grid-cols-3">
				{#each steps as step, i}
					<div
						bind:this={stepEls[i]}
						data-step={i}
						class="rounded-xl border p-8 transition-all duration-500 {activeStep >= i
							? 'border-accent-primary/30 bg-accent-primary/5'
							: 'border-border-subtle bg-bg-card'}"
					>
						<div
							class="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold transition-all duration-500 {activeStep >=
							i
								? 'bg-accent-primary text-white'
								: 'bg-text-muted/20 text-text-muted'}"
						>
							{step.number}
						</div>
						<h3 class="text-xl font-semibold">{step.title}</h3>
						<p class="mt-3 text-sm leading-relaxed text-text-muted">{step.desc}</p>
					</div>
				{/each}
			</div>

			<div class="mt-8 hidden items-center justify-center md:flex">
				<div class="flex h-1 w-full max-w-md items-center gap-0">
					{#each steps as _, i}
						<div
							class="h-1 flex-1 transition-all duration-500 {activeStep >= i
								? 'bg-accent-primary'
								: 'bg-border-subtle'}"
						></div>
						{#if i < steps.length - 1}
							<div class="w-2"></div>
						{/if}
					{/each}
				</div>
			</div>
		</Reveal>
	</div>
</section>

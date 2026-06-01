<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';
	import TiltCard from '$components/ui/TiltCard.svelte';

	let { sectionProgress = 0 } = $props();

	let isAnnual = $state(false);

	const monthly = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			features: ['100 documents', '1,000 queries/mo', 'Basic retrieval'],
			cta: 'Get Started',
			popular: false
		},
		{
			name: 'Pro',
			price: '$29',
			period: '/month',
			features: [
				'10,000 documents',
				'Unlimited queries',
				'Advanced retrieval + reranking',
				'Priority support'
			],
			cta: 'Start Free Trial',
			popular: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			features: ['Unlimited documents', 'On-prem deployment', 'Dedicated support', 'SLA guarantee'],
			cta: 'Contact Sales',
			popular: false
		}
	];

	const annual = monthly.map((tier, i) => {
		if (i === 1)
			return {
				...tier,
				price: '$290',
				period: '/year',
				features: [...tier.features, '2 months free']
			};
		return tier;
	});

	let plans = $derived(isAnnual ? annual : monthly);
</script>

<section
	id="pricing"
	class="relative flex min-h-screen w-full items-center bg-bg-primary px-8 md:px-16"
>
	<div class="mx-auto w-full max-w-6xl">
		<Reveal progress={sectionProgress}>
			<div class="text-center">
				<p class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">Pricing</p>
				<h2 class="mt-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
					Simple, transparent
				</h2>
			</div>
		</Reveal>

		<Reveal progress={sectionProgress} stagger={0.06}>
			<div class="mt-8 flex items-center justify-center gap-4">
				<span class="text-sm" class:text-accent-primary={!isAnnual} class:text-text-muted={isAnnual}
					>Monthly</span
				>
				<button
					onclick={() => {
						isAnnual = !isAnnual;
					}}
					class="relative h-6 w-12 rounded-full transition-colors duration-300 {isAnnual
						? 'bg-accent-primary'
						: 'bg-border-subtle'}"
					aria-label="Toggle"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300"
						class:translate-x-6={isAnnual}
					></div>
				</button>
				<span class="text-sm" class:text-accent-primary={isAnnual} class:text-text-muted={!isAnnual}
					>Annual <span class="text-accent-primary">Save 17%</span></span
				>
			</div>
		</Reveal>

		<div class="mt-12 grid gap-4 md:grid-cols-3">
			{#each plans as plan, i}
				<Reveal progress={sectionProgress} stagger={0.12 + i * 0.04}>
					<TiltCard glowColor={plan.popular ? '232, 99, 74' : '136, 133, 124'}>
						<div
							class="rounded-2xl bg-white p-8 transition-all duration-300 {plan.popular
								? 'scale-[1.02] shadow-md ring-1 shadow-accent-primary/10 ring-accent-primary/20'
								: 'shadow-sm'}"
						>
							{#if plan.popular}
								<div
									class="mb-4 inline-block rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-accent-primary uppercase"
								>
									Popular
								</div>
							{/if}
							<h3 class="text-xl font-semibold">{plan.name}</h3>
							<div class="mt-4">
								<span class="text-5xl font-bold">{plan.price}</span>
								{#if plan.period}<span class="ml-1 text-sm text-text-muted">/{plan.period}</span
									>{/if}
							</div>
							<ul class="mt-8 space-y-3" role="list">
								{#each plan.features as feature}
									<li class="flex items-start gap-3 text-sm text-text-muted">
										<span class="mt-0.5 shrink-0 text-accent-secondary">&#10003;</span>
										{feature}
									</li>
								{/each}
							</ul>
							<a
								href={plan.name === 'Free' ? '/signup' : plan.name === 'Pro' ? '/pricing' : 'mailto:sales@memory.dev'}
								class="mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 active:scale-95 {plan.popular
									? 'bg-accent-primary text-white hover:bg-accent-primary/90'
									: 'bg-bg-primary text-text-muted hover:text-accent-primary'}"
							>
								{plan.cta}
							</a>
						</div>
					</TiltCard>
				</Reveal>
			{/each}
		</div>
	</div>
</section>

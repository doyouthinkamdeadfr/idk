<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';

	let isAnnual = $state(false);

	const monthly = [
		{
			name: 'Free',
			price: '$0',
			period: 'forever',
			features: ['100 documents', '1,000 queries/mo', 'Basic retrieval', 'Community support'],
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
				'Priority support',
				'Custom data sources'
			],
			cta: 'Start Free Trial',
			popular: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			period: '',
			features: [
				'Unlimited documents',
				'Unlimited queries',
				'On-prem deployment',
				'Dedicated support',
				'SLA guarantee',
				'Custom integrations'
			],
			cta: 'Contact Sales',
			popular: false
		}
	];

	const annual = monthly.map((tier, i) => {
		if (i === 1) {
			return {
				...tier,
				price: '$290',
				period: '/year',
				features: [...tier.features, '2 months free']
			};
		}
		return tier;
	});

	let plans = $derived(isAnnual ? annual : monthly);
</script>

<section id="pricing" class="relative w-full px-6 py-28 md:px-10 md:py-36">
	<div class="mx-auto max-w-6xl">
		<Reveal>
			<div class="text-center">
				<span class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">Pricing</span
				>
				<h2 class="mt-3 text-3xl leading-tight font-bold md:text-4xl">
					Simple, transparent pricing
				</h2>
				<p class="mx-auto mt-4 max-w-xl text-base text-text-muted">
					Start free, scale as you grow. No hidden fees.
				</p>
			</div>

			<div class="mt-8 flex items-center justify-center gap-4">
				<span class="text-sm text-text-muted" class:text-accent-primary={!isAnnual}>Monthly</span>
				<button
					onclick={() => {
						isAnnual = !isAnnual;
					}}
					class="relative h-6 w-12 rounded-full transition-colors duration-300 {isAnnual
						? 'bg-accent-primary'
						: 'bg-border-subtle'}"
					aria-label="Toggle annual pricing"
				>
					<div
						class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300"
						class:translate-x-6={isAnnual}
					></div>
				</button>
				<span class="text-sm" class:text-accent-primary={isAnnual}>
					<span class="text-text-muted">Annual</span>
					<span class="text-accent-primary">Save 17%</span>
				</span>
			</div>

			<div class="mt-12 grid gap-6 md:grid-cols-3">
				{#each plans as plan, i}
					<div
						class="group relative overflow-hidden rounded-xl border p-8 transition-all duration-300 {plan.popular
							? 'border-accent-primary/30 shadow-md shadow-accent-primary/5'
							: 'border-border-subtle'}"
					>
						{#if plan.popular}
							<div
								class="absolute top-0 right-0 rounded-bl-lg bg-accent-primary px-4 py-1.5 text-xs font-semibold text-white"
							>
								Popular
							</div>
						{/if}

						<h3 class="text-lg font-semibold text-text-primary">{plan.name}</h3>
						<div class="mt-4">
							<span class="text-4xl font-bold text-text-primary">{plan.price}</span>
							{#if plan.period}<span class="ml-1 text-sm text-text-muted">/{plan.period}</span>{/if}
						</div>

						<ul class="mt-8 space-y-3" role="list">
							{#each plan.features as feature}
								<li class="flex items-start gap-3 text-sm text-text-muted">
									<span class="mt-0.5 text-accent-secondary">&#10003;</span>
									{feature}
								</li>
							{/each}
						</ul>

						<a
							href="#cta"
							class="mt-8 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all duration-200 active:scale-95 {plan.popular
								? 'bg-accent-primary text-white hover:bg-accent-primary/90'
								: 'border border-border-subtle text-text-muted hover:border-accent-primary hover:text-accent-primary'}"
						>
							{plan.cta}
						</a>
					</div>
				{/each}
			</div>
		</Reveal>
	</div>
</section>

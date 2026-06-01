<script lang="ts">
	import { authClient } from '$lib/auth-client';

	let isAnnual = $state(false);
	let session = $state<any>(null);

	authClient.useSession.subscribe((s: any) => {
		session = s?.data;
	});

	const freeTier = {
		name: 'Free',
		price: '$0',
		period: 'forever',
		features: ['100 documents', '1,000 queries/mo', 'Basic retrieval'],
		popular: false,
		action: null as (() => Promise<void>) | null
	};

	const proFeatures = $derived([
		'10,000 documents',
		'Unlimited queries',
		'Advanced retrieval + reranking',
		'Priority support',
		...(isAnnual ? ['2 months free'] : [])
	]);

	const proTier = {
		name: 'Pro',
		monthlyPrice: '$29',
		annualPrice: '$290',
		get period() { return isAnnual ? '/year' : '/month'; },
		get features() { return proFeatures; },
		popular: true,
		action: async () => {
			if (!session?.user) {
				window.location.href = '/login?redirect=/pricing';
				return;
			}
			try {
				await authClient.checkout({ slug: isAnnual ? 'pro-annual' : 'pro-monthly' });
			} catch (e) {
				console.error('Checkout failed:', e);
				alert('Checkout failed. Please try again.');
			}
		}
	};

	const enterpriseTier = {
		name: 'Enterprise',
		price: 'Custom',
		period: '',
		features: ['Unlimited documents', 'On-prem deployment', 'Dedicated support', 'SLA guarantee'],
		popular: false,
		action: null as (() => Promise<void>) | null
	};

	const tiers = [freeTier, proTier, enterpriseTier];
</script>

<svelte:head>
	<title>Pricing — Memory</title>
</svelte:head>

<section class="flex min-h-screen w-full items-center bg-bg-primary px-8 pt-24 md:px-16">
	<div class="mx-auto w-full max-w-6xl">
		<div class="text-center">
			<p class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">Pricing</p>
			<h2 class="mt-4 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
				Simple, transparent
			</h2>
		</div>

		<div class="mt-8 flex items-center justify-center gap-4">
			<span class="text-sm" class:text-accent-primary={!isAnnual} class:text-text-muted={isAnnual}>
				Monthly
			</span>
			<button
				onclick={() => (isAnnual = !isAnnual)}
				class="relative h-6 w-12 rounded-full transition-colors duration-300 {isAnnual
					? 'bg-accent-primary'
					: 'bg-border-subtle'}"
				aria-label="Toggle billing period"
			>
				<div
					class="absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-300"
					class:translate-x-6={isAnnual}
				></div>
			</button>
			<span class="text-sm" class:text-accent-primary={isAnnual} class:text-text-muted={!isAnnual}>
				Annual <span class="text-accent-primary">Save 17%</span>
			</span>
		</div>

		<div class="mt-12 grid gap-4 md:grid-cols-3">
			{#each tiers as tier}
				<div
					class="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 {tier.popular
						? 'scale-[1.02] shadow-md ring-1 shadow-accent-primary/10 ring-accent-primary/20'
						: ''}"
				>
					{#if tier.popular}
						<div
							class="mb-4 inline-block rounded-full bg-accent-primary/10 px-3 py-1 text-xs font-semibold tracking-wider text-accent-primary uppercase"
						>
							Popular
						</div>
					{/if}
					<h3 class="text-xl font-semibold">{tier.name}</h3>
					<div class="mt-4">
						<span class="text-5xl font-bold">
							{tier.name === 'Pro' ? (isAnnual ? tier.annualPrice : tier.monthlyPrice) : tier.price}
						</span>
						{#if tier.period}
							<span class="ml-1 text-sm text-text-muted">
								/{typeof tier.period === 'function' ? tier.period() : tier.period}
							</span>
						{/if}
					</div>
					<ul class="mt-8 space-y-3" role="list">
						{#each tier.features as feature}
							<li class="flex items-start gap-3 text-sm text-text-muted">
								<span class="mt-0.5 shrink-0 text-accent-secondary">&#10003;</span>
								{feature}
							</li>
						{/each}
					</ul>
					{#if tier.action}
						<button
							onclick={tier.action}
							class="mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 active:scale-95 {tier.popular
								? 'bg-accent-primary text-white hover:bg-accent-primary/90'
								: 'bg-bg-primary text-text-muted hover:text-accent-primary'}"
						>
							{tier.name === 'Pro' ? 'Upgrade' : tier.name === 'Free' ? 'Get Started' : 'Contact Sales'}
						</button>
					{:else if tier.name === 'Free'}
						<a
							href="/signup"
							class="mt-8 block w-full rounded-xl bg-bg-primary py-3 text-center text-sm font-semibold text-text-muted transition-all duration-200 hover:text-accent-primary active:scale-95"
						>
							Get Started
						</a>
					{:else}
						<a
							href="mailto:sales@memory.dev"
							class="mt-8 block w-full rounded-xl bg-bg-primary py-3 text-center text-sm font-semibold text-text-muted transition-all duration-200 hover:text-accent-primary active:scale-95"
						>
							Contact Sales
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

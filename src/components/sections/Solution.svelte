<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';
	import Counter from '$components/ui/Counter.svelte';
</script>

<section class="relative w-full bg-accent-primary/5 px-6 py-28 md:px-10 md:py-36">
	<div class="mx-auto max-w-6xl">
		<Reveal>
			<div class="text-center">
				<span class="text-xs font-semibold tracking-[0.2em] text-accent-primary uppercase"
					>The Solution</span
				>
				<h2 class="mt-3 text-3xl leading-tight font-bold md:text-4xl">
					Ask. Retrieve. Answer. <span class="text-accent-primary">In milliseconds.</span>
				</h2>
				<p class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
					Connect your knowledge sources once. Ask in plain English. Get instant answers with
					citations you can verify.
				</p>
			</div>

			<div class="mt-16 grid gap-8 sm:grid-cols-3">
				<div class="rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
					<div class="text-4xl font-bold text-accent-primary">
						<Counter value={50000} suffix="+" />
					</div>
					<p class="mt-2 text-sm text-text-muted">Documents indexed</p>
				</div>
				<div class="rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
					<div class="text-4xl font-bold text-accent-secondary">
						<Counter value={997} prefix="" suffix="%" duration={1500} />
					</div>
					<p class="mt-2 text-sm text-text-muted">Retrieval accuracy</p>
				</div>
				<div class="rounded-xl border border-border-subtle bg-bg-card p-8 text-center">
					<div class="text-4xl font-bold text-accent-primary">
						<Counter value={2000000} suffix="+" duration={2000} />
					</div>
					<p class="mt-2 text-sm text-text-muted">Queries answered</p>
				</div>
			</div>
		</Reveal>
	</div>
</section>

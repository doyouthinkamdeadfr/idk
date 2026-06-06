<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';

	let { sectionProgress = 0 } = $props();
</script>

<section
	id="cta"
	class="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-accent-primary/10 via-accent-warm/10 to-accent-secondary/10 px-8 md:px-16"
>
	<div class="flex flex-1 items-center justify-center py-20">
		<div class="mx-auto w-full max-w-3xl text-center">
			<Reveal progress={sectionProgress}>
				<h2 class="text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
					Ready to get answers<br />
					<span class="text-accent-primary">in milliseconds?</span>
				</h2>
			</Reveal>
			<Reveal progress={sectionProgress} stagger={0.08}>
				<p class="mx-auto mt-6 max-w-lg text-base leading-relaxed text-text-muted md:text-lg">
					Join thousands of teams using Memory to retrieve, augment, and generate insights from
					their data.
				</p>
			</Reveal>
			<Reveal progress={sectionProgress} stagger={0.14}>
				<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
					<a
						href="#cta"
						class="group relative inline-block rounded-full bg-accent-primary px-10 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent-primary/20 transition-all duration-200 hover:bg-accent-primary/90 hover:shadow-xl hover:shadow-accent-primary/30 active:scale-95"
					>
						<span class="relative z-10">Start Free Trial</span>
						<span
							class="absolute inset-0 rounded-full bg-accent-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
							style="filter: blur(12px);"
						></span>
					</a>
					<a
						href="#cta"
						class="inline-block rounded-full border border-text-muted/30 px-10 py-3.5 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
					>
						Talk to Sales
					</a>
				</div>
			</Reveal>
		</div>
	</div>

	<footer class="w-full border-t border-border-subtle/50 py-12">
		<div class="mx-auto flex w-full max-w-6xl flex-col gap-10 md:flex-row md:justify-between">
			<div class="max-w-xs">
				<a href="/" class="text-lg font-bold tracking-tight text-text-primary">Memory</a>
				<p class="mt-2 text-sm leading-relaxed text-text-muted">
					Answers from your data. In milliseconds.
				</p>
			</div>

			<div class="flex flex-wrap gap-10">
				<div>
					<h4 class="mb-3 text-xs font-semibold tracking-widest text-text-muted uppercase">
						Product
					</h4>
					<div class="flex flex-col gap-2 text-sm text-text-muted">
						<a href="#how-it-works" class="transition-colors hover:text-accent-primary"
							>How it works</a
						>
						<a href="#benchmarks" class="transition-colors hover:text-accent-primary">Benchmarks</a>
						<a href="#pricing" class="transition-colors hover:text-accent-primary">Pricing</a>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold tracking-widest text-text-muted uppercase">
						Company
					</h4>
					<div class="flex flex-col gap-2 text-sm text-text-muted">
						<a href="/" class="transition-colors hover:text-accent-primary">GitHub</a>
						<a href="/" class="transition-colors hover:text-accent-primary">Twitter</a>
						<a href="/" class="transition-colors hover:text-accent-primary">Docs</a>
					</div>
				</div>
				<div>
					<h4 class="mb-3 text-xs font-semibold tracking-widest text-text-muted uppercase">
						Updates
					</h4>
					<form class="flex gap-2" onsubmit={(e) => e.preventDefault()}>
						<input
							type="email"
							placeholder="your@email.com"
							class="w-44 rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
						/>
						<button
							type="submit"
							class="rounded-lg bg-accent-primary px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-primary/90 active:scale-95"
						>
							Join
						</button>
					</form>
				</div>
			</div>
		</div>
		<p class="mt-10 text-center text-xs text-text-muted">
			&copy; 2026 Memory. answers in milliseconds.
		</p>
	</footer>
</section>

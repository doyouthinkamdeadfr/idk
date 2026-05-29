<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';

	let { sectionProgress = 0 } = $props();
</script>

<section class="relative flex min-h-screen w-full items-center px-8 py-20 md:px-16">
	<div class="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
		<Reveal progress={sectionProgress}>
			<div>
				<p class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase">The Problem</p>
				<h2 class="mt-4 text-3xl leading-tight font-bold md:text-4xl lg:text-5xl">
					Your data is scattered.<br />
					<span class="text-accent-primary">Your answers are slow.</span>
				</h2>
			</div>
		</Reveal>

		<Reveal progress={sectionProgress} stagger={0.08}>
			<div class="space-y-6">
				<div class="border-l-2 border-accent-primary/30 pl-5">
					<p class="text-base font-semibold md:text-lg">Search across 5+ tools</p>
					<p class="mt-1 text-sm leading-relaxed text-text-muted">
						Drive, Slack, Notion, GitHub, wiki — your knowledge is everywhere except where you
						need it.
					</p>
				</div>
				<div class="border-l-2 border-text-muted/20 pl-5">
					<p class="text-base font-semibold md:text-lg">Minutes per query</p>
					<p class="mt-1 text-sm leading-relaxed text-text-muted">
						Average time to find, verify, and compile an answer from scattered sources.
					</p>
				</div>
				<div class="border-l-2 border-text-muted/20 pl-5">
					<p class="text-base font-semibold md:text-lg">No source context</p>
					<p class="mt-1 text-sm leading-relaxed text-text-muted">
						Black-box answers you can't trust or verify against the original data.
					</p>
				</div>
			</div>
		</Reveal>
	</div>
</section>

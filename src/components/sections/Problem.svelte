<script lang="ts">
	import Reveal from '$components/ui/Reveal.svelte';
</script>

<section class="relative w-full px-6 py-28 md:px-10 md:py-36">
	<div class="mx-auto max-w-6xl">
		<Reveal>
			<div class="grid gap-12 lg:grid-cols-2 lg:gap-20">
				<div>
					<span class="text-xs font-semibold tracking-[0.2em] text-text-muted uppercase"
						>The Problem</span
					>
					<h2 class="mt-3 text-3xl leading-tight font-bold md:text-4xl">
						Your data is scattered.<br />
						Your answers are slow.
					</h2>
					<p class="mt-4 max-w-md text-base leading-relaxed text-text-muted md:text-lg">
						Documents in Drive. Code in repos. Knowledge in Notion. Each new tool creates another
						silo — and finding what you need means digging through all of them. Traditional search
						is fragmented, context-blind, and painfully slow.
					</p>
				</div>
				<div class="space-y-6">
					<div class="rounded-xl border border-border-subtle bg-bg-card p-6">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-lg">
								&#x1F50D;
							</div>
							<div>
								<div class="font-semibold">Search across 5+ tools</div>
								<div class="text-sm text-text-muted">Drive, Slack, Notion, GitHub, wiki</div>
							</div>
						</div>
					</div>
					<div class="rounded-xl border border-border-subtle bg-bg-card p-6">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-lg">
								&#x23F0;
							</div>
							<div>
								<div class="font-semibold">Minutes per query</div>
								<div class="text-sm text-text-muted">Average time to find and verify an answer</div>
							</div>
						</div>
					</div>
					<div class="rounded-xl border border-border-subtle bg-bg-card p-6">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-lg">
								&#x2753;
							</div>
							<div>
								<div class="font-semibold">No source context</div>
								<div class="text-sm text-text-muted">Answers without citations you can trust</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Reveal>
	</div>
</section>

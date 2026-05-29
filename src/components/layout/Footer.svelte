<footer class="flex h-full w-full flex-col items-center justify-center px-6 md:px-10">
	<div class="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:justify-between">
		<div class="max-w-xs">
			<a href="/" class="text-lg font-bold tracking-tight text-text-primary">supermemory</a>
			<p class="mt-2 text-sm leading-relaxed text-text-muted">
				Answers from your data. In milliseconds.
			</p>
		</div>

		<div class="flex flex-wrap gap-12">
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
	<p class="mt-12 text-center text-xs text-text-muted">
		&copy; 2026 supermemory. answers in milliseconds.
	</p>
</footer>

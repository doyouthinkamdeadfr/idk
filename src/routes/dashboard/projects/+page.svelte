<script lang="ts">
	import { mockProjects } from '$lib/mock';

	let projects = $state([...mockProjects]);
</script>

<div class="mx-auto max-w-4xl px-6 py-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-primary">Projects</h1>
			<p class="mt-1 text-sm text-text-muted">{projects.length} projects</p>
		</div>
		<button
			class="rounded-full bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-primary/90 active:scale-95"
		>
			+ New Project
		</button>
	</div>

	<div class="mt-8 grid gap-4 md:grid-cols-2">
		{#each projects as proj (proj.id)}
			<div
				class="rounded-2xl border border-border-subtle bg-white p-6 transition-shadow hover:shadow-sm"
			>
				<h3 class="text-base font-semibold text-text-primary">{proj.name}</h3>
				<p class="mt-1 line-clamp-2 text-xs text-text-muted">{proj.description}</p>
				<div class="mt-4 flex items-center gap-2">
					<span class="text-xs text-text-muted">{proj.docCount} documents</span>
					<span class="h-1 w-1 rounded-full bg-border-subtle"></span>
					<button class="text-xs text-accent-primary hover:underline">Open</button>
				</div>
			</div>
		{/each}
	</div>
</div>

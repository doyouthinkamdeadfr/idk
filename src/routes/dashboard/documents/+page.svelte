<script lang="ts">
	import { mockDocuments } from '$lib/mock';

	let documents = $state([...mockDocuments]);

	const typeIcons: Record<string, string> = {
		pdf: '📄',
		doc: '📝',
		txt: '📃',
		link: '🔗',
	};
</script>

<div class="mx-auto max-w-4xl px-6 py-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-primary">Documents</h1>
			<p class="mt-1 text-sm text-text-muted">{documents.length} documents indexed</p>
		</div>
		<button
			class="rounded-full bg-accent-primary px-5 py-2 text-sm font-semibold text-white hover:bg-accent-primary/90 transition-all active:scale-95"
		>
			+ Upload
		</button>
	</div>

	<div class="mt-8 space-y-2">
		{#each documents as doc (doc.id)}
			<div class="flex items-center gap-4 rounded-2xl border border-border-subtle bg-white px-5 py-4 transition-shadow hover:shadow-sm">
				<span class="text-lg">{typeIcons[doc.type] || '📄'}</span>
				<div class="flex-1 min-w-0">
					<p class="text-sm font-medium text-text-primary truncate">{doc.name}</p>
					<p class="text-xs text-text-muted">{doc.date.toLocaleDateString()}{doc._size ? ` · ${doc._size}` : ''}</p>
				</div>
				<span class="rounded-full bg-bg-primary px-2.5 py-0.5 text-[10px] font-medium text-text-muted uppercase">{doc.type}</span>
			</div>
		{/each}
	</div>
</div>

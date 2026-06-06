<script lang="ts">
	interface ImageDoc {
		id: string;
		name: string;
		type: string;
		mime: string;
		size: number;
		status: 'processing' | 'ready' | 'error';
		content: string | null;
		created_at: string;
	}

	let images = $state<ImageDoc[]>([]);
	let loaded = $state(false);

	$effect(() => {
		if (!loaded) {
			loadImages();
		}
	});

	async function loadImages() {
		const res = await fetch('/api/documents');
		const all = await res.json();
		images = all.filter((d: any) => d.type === 'image');
		images.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
		loaded = true;
	}

	async function deleteImage(id: string) {
		await fetch(`/api/documents/${id}`, { method: 'DELETE' });
		images = images.filter((d) => d.id !== id);
	}

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}
</script>

<div class="mx-auto max-w-5xl px-6 py-8">
	<div>
		<h1 class="text-2xl font-bold text-text-primary">Images</h1>
		<p class="mt-1 text-sm text-text-muted">{images.length} images indexed</p>
	</div>

	{#if images.length === 0 && loaded}
		<div class="py-12 text-center text-sm text-text-muted">
			No images yet. Upload images in a chat to get started.
		</div>
	{/if}

	<div class="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
		{#each images as img (img.id)}
			<div
				class="group relative overflow-hidden rounded-2xl border border-border-subtle bg-white transition-shadow hover:shadow-md"
			>
				<div class="flex aspect-square items-center justify-center bg-bg-primary text-4xl">🖼️</div>
				<div class="p-3">
					<p class="truncate text-sm font-medium text-text-primary">{img.name}</p>
					<p class="mt-0.5 text-[11px] text-text-muted">
						{new Date(img.created_at).toLocaleDateString()}
						{img.size ? ` · ${formatSize(img.size)}` : ''}
					</p>
				</div>
				{#if img.content}
					<div
						class="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<p class="line-clamp-3 text-xs text-white/90">{img.content}</p>
					</div>
				{/if}
				<button
					onclick={() => deleteImage(img.id)}
					class="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
				>
					&times;
				</button>
			</div>
		{/each}
	</div>
</div>

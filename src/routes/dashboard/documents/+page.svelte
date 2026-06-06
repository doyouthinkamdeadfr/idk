<script lang="ts">
	interface Doc {
		id: string;
		name: string;
		type: 'file' | 'image' | 'link';
		mime: string;
		size: number;
		status: 'processing' | 'ready' | 'error';
		error: string | null;
		created_at: string;
	}

	let documents = $state<Doc[]>([]);
	let loaded = $state(false);

	$effect(() => {
		if (!loaded) {
			loadDocuments();
		}
	});

	async function loadDocuments() {
		const res = await fetch('/api/documents');
		documents = await res.json();
		loaded = true;
	}

	async function deleteDoc(id: string) {
		await fetch(`/api/documents/${id}`, { method: 'DELETE' });
		documents = documents.filter((d) => d.id !== id);
	}

	async function uploadFiles() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.txt,.md,image/*';
		input.multiple = true;
		input.onchange = async () => {
			if (!input.files) return;
			const form = new FormData();
			let hasLink = false;
			for (const f of input.files) {
				form.append('files[]', f, f.name);
			}
			// Create a temp chat to upload into
			const chatRes = await fetch('/api/chats', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ title: `Upload: ${input.files[0].name}` })
			});
			if (!chatRes.ok) return;
			const chat = await chatRes.json();

			form.set('text', '');
			form.set('links', JSON.stringify([]));

			await fetch(`/api/chats/${chat.id}/messages`, { method: 'POST', body: form });
			await loadDocuments();

			// Clean up the auto-created chat
			await fetch(`/api/chats/${chat.id}`, { method: 'DELETE' });
		};
		input.click();
	}

	const typeIcons: Record<string, string> = {
		file: '📄',
		image: '🖼️',
		link: '🔗'
	};

	function formatSize(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	}

	function statusLabel(status: string): string {
		if (status === 'processing') return 'Processing...';
		if (status === 'ready') return 'Ready';
		return 'Error';
	}
</script>

<div class="mx-auto max-w-4xl px-6 py-8">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold text-text-primary">Documents</h1>
			<p class="mt-1 text-sm text-text-muted">{documents.length} documents indexed</p>
		</div>
		<button
			onclick={uploadFiles}
			class="rounded-full bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-accent-primary/90 active:scale-95"
		>
			+ Upload
		</button>
	</div>

	<div class="mt-8 space-y-2">
		{#each documents as doc (doc.id)}
			<div
				class="flex items-center gap-4 rounded-2xl border border-border-subtle bg-white px-5 py-4 transition-shadow hover:shadow-sm"
			>
				<span class="text-lg">{typeIcons[doc.type] || '📄'}</span>
				<div class="min-w-0 flex-1">
					<div class="flex items-center gap-2">
						<p class="truncate text-sm font-medium text-text-primary">{doc.name}</p>
						{#if doc.status === 'processing'}
							<span
								class="inline-block h-3 w-3 animate-pulse rounded-full bg-amber-400"
								title="Processing"
							></span>
						{:else if doc.status === 'error'}
							<span
								class="inline-block h-3 w-3 rounded-full bg-red-400"
								title={doc.error || 'Error'}
							></span>
						{:else}
							<span class="inline-block h-3 w-3 rounded-full bg-green-400" title="Ready"></span>
						{/if}
					</div>
					<p class="text-xs text-text-muted">
						{new Date(doc.created_at).toLocaleDateString()}
						{doc.size ? ` · ${formatSize(doc.size)}` : ''}
						{doc.status === 'error' ? ` · ${doc.error || 'processing failed'}` : ''}
					</p>
				</div>
				<span
					class="rounded-full bg-bg-primary px-2.5 py-0.5 text-[10px] font-medium text-text-muted uppercase"
					>{doc.type}</span
				>
				<button
					onclick={() => deleteDoc(doc.id)}
					class="rounded-lg px-2 py-1 text-xs text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
				>
					Delete
				</button>
			</div>
		{/each}

		{#if documents.length === 0 && loaded}
			<div class="py-12 text-center text-sm text-text-muted">
				No documents yet. Upload files or attach them in a chat to get started.
			</div>
		{/if}
	</div>
</div>

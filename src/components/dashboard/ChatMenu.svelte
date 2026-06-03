<script lang="ts">
	interface Props {
		chatId: string;
		pinned: boolean;
		archived: boolean;
		onPin: (id: string) => void;
		onArchive: (id: string) => void;
		onDelete: (id: string) => void;
		onShare: (id: string) => void;
	}

	let { chatId, pinned, archived, onPin, onArchive, onDelete, onShare }: Props = $props();

	let open = $state(false);

	function toggle(e: MouseEvent) {
		e.stopPropagation();
		open = !open;
	}

	function close() {
		open = false;
	}

	function handle(fn: (id: string) => void) {
		fn(chatId);
		close();
	}
</script>

<svelte:window onclick={close} />

<div class="relative">
	<button
		onclick={toggle}
		class="flex h-6 w-6 items-center justify-center rounded text-text-muted opacity-0 group-hover:opacity-100 hover:bg-bg-primary hover:text-text-primary transition-all"
	>
		<svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
			<path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
		</svg>
	</button>

	{#if open}
		<div
			class="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-border-subtle bg-white py-1 shadow-lg"
			onclick={(e) => e.stopPropagation()}
		>
			<button onclick={() => handle(onShare)} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
				<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
				Share
			</button>
			<button onclick={() => handle(onPin)} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
				<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
				{pinned ? 'Unpin' : 'Pin'}
			</button>
			<button onclick={() => handle(onArchive)} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
				<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
				{archived ? 'Unarchive' : 'Archive'}
			</button>
			<div class="my-1 border-t border-border-subtle"></div>
			<button onclick={() => handle(onDelete)} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
				<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
				Delete
			</button>
		</div>
	{/if}
</div>

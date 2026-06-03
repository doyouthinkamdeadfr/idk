<script lang="ts">
	interface Props {
		onSend: (text: string) => void;
	}

	let { onSend }: Props = $props();

	let text = $state('');
	let addMenuOpen = $state(false);

	function handleSend() {
		const t = text.trim();
		if (!t) return;
		onSend(t);
		text = '';
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	function toggleAddMenu(e: MouseEvent) {
		e.stopPropagation();
		addMenuOpen = !addMenuOpen;
	}

	function closeAddMenu() {
		addMenuOpen = false;
	}

	function autoResize(e: Event) {
		const el = e.target as HTMLTextAreaElement;
		el.style.height = 'auto';
		el.style.height = Math.min(el.scrollHeight, 160) + 'px';
	}
</script>

<svelte:window onclick={closeAddMenu} />

<div class="px-6 py-4">
	<div class="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border-subtle bg-white px-3 py-2">
		<div class="relative">
			<button
				onclick={toggleAddMenu}
				class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white transition-all"
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
			</button>
			{#if addMenuOpen}
				<div class="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-border-subtle bg-white py-1 shadow-lg" onclick={(e) => e.stopPropagation()}>
					<button onclick={closeAddMenu} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
						Add photos
					</button>
					<button onclick={closeAddMenu} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
						Add files
					</button>
					<button onclick={closeAddMenu} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
						Recent files
					</button>
					<button onclick={closeAddMenu} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
						Attach links
					</button>
					<div class="my-1 border-t border-border-subtle"></div>
					<button onclick={closeAddMenu} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
						Start group chat
					</button>
				</div>
			{/if}
		</div>

		<textarea
			bind:value={text}
			onkeydown={handleKeydown}
			oninput={autoResize}
			rows="1"
			placeholder="Type a message..."
			class="max-h-40 flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none leading-relaxed py-1"
		></textarea>

		<div class="flex items-center gap-1">
			<button class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white transition-all">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
				</svg>
			</button>
			<button
				onclick={handleSend}
				class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-all active:scale-95"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>
</div>

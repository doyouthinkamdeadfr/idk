<script lang="ts">
	import { page } from '$app/stores';

	let chatId = $derived($page.data.chatId as string);
	let messages = $state<Array<{role: 'user' | 'assistant', content: string}>>([
		{ role: 'assistant', content: 'Hello! How can I help you with your data today?' }
	]);
	let input = $state('');

	function send() {
		const text = input.trim();
		if (!text) return;
		messages = [...messages, { role: 'user', content: text }];
		input = '';
		setTimeout(() => {
			messages = [...messages, { role: 'assistant', content: 'This is a placeholder response. The RAG integration is coming soon.' }];
		}, 600);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="flex-1 overflow-y-auto px-6 py-6">
		<div class="mx-auto max-w-3xl space-y-6">
			{#each messages as msg}
				<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div
						class="max-w-[80%] rounded-2xl px-4 py-3 text-sm {msg.role === 'user' ? 'bg-accent-primary text-white' : 'bg-white border border-border-subtle text-text-primary'}"
					>
						{msg.content}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="border-t border-border-subtle bg-white px-6 py-4">
		<div class="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border-subtle bg-bg-primary px-4 py-3">
			<div class="relative">
				<button class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white transition-all">
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
				</button>
			</div>
			<textarea
				bind:value={input}
				onkeydown={handleKeydown}
				rows="1"
				placeholder="Type a message..."
				class="flex-1 resize-none bg-transparent text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
			></textarea>
			<div class="flex items-center gap-1">
				<button class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-white transition-all">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
					</svg>
				</button>
				<button
					onclick={send}
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-primary text-white hover:bg-accent-primary/90 transition-all active:scale-95"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>

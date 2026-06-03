<script lang="ts">
	import { page } from '$app/stores';
	import ChatInput from '$components/dashboard/ChatInput.svelte';

	let chatId = $derived($page.data.chatId as string);
	let messages = $state<Array<{role: 'user' | 'assistant', content: string}>>([
		{ role: 'assistant', content: 'Hello! How can I help you with your data today?' }
	]);

	function send(text: string) {
		messages = [...messages, { role: 'user', content: text }];
		setTimeout(() => {
			messages = [...messages, { role: 'assistant', content: 'This is a placeholder response. The RAG integration is coming soon.' }];
		}, 600);
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

	<ChatInput {send} />
</div>

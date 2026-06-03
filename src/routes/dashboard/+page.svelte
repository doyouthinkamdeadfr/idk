<script lang="ts">
	import EmptyChatState from '$components/dashboard/EmptyChatState.svelte';
	import ChatInput from '$components/dashboard/ChatInput.svelte';

	let messages: Array<{role: 'user' | 'assistant', content: string}> = $state([]);

	function send(text: string) {
		messages = [...messages, { role: 'user', content: text }];
		setTimeout(() => {
			messages = [...messages, { role: 'assistant', content: 'This is a placeholder response. The RAG integration is coming soon.' }];
		}, 600);
	}
</script>

<div class="flex h-full flex-col">
	{#if messages.length === 0}
		<div class="flex flex-1 flex-col items-center justify-center px-6">
			<EmptyChatState />
			<div class="mt-8 w-full max-w-3xl">
				<ChatInput {send} />
			</div>
		</div>
	{:else}
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
	{/if}
</div>

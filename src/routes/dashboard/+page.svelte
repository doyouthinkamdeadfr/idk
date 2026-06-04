<script lang="ts">
	import { goto } from '$app/navigation';
	import EmptyChatState from '$components/dashboard/EmptyChatState.svelte';
	import ChatInput from '$components/dashboard/ChatInput.svelte';
	import { readSSEStream } from '$lib/sse';

	let messages = $state<Array<{role: 'user' | 'assistant', content: string, sources?: any[]}>>([]);
	let isStreaming = $state(false);

	async function send(payload: { text: string; attachments: { type: string; name: string; file?: File; url?: string }[] }) {
		isStreaming = true;

		// Add user message locally
		let userContent = payload.text;
		if (payload.attachments.length > 0) {
			const names = payload.attachments.map(a => a.name).join(', ');
			userContent = userContent ? `${userContent}\n[Attached: ${names}]` : `[Attached: ${names}]`;
		}
		messages = [...messages, { role: 'user', content: userContent }];

		try {
			// Create new chat
			const chatRes = await fetch('/api/chats', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ title: payload.text?.slice(0, 60) || 'New Chat' })
			});
			if (!chatRes.ok) throw new Error('Failed to create chat');
			const chat = await chatRes.json();
			const chatId = chat.id;

			// Build FormData
			const form = new FormData();
			form.set('text', payload.text);
			if (payload.attachments.length > 0) {
				const files = payload.attachments.filter(a => a.file);
				const links = payload.attachments.filter(a => a.url).map(a => a.url);
				for (const f of files) form.append('files[]', f.file!, f.name);
				if (links.length > 0) form.set('links', JSON.stringify(links));
			}

			const msgRes = await fetch(`/api/chats/${chatId}/messages`, { method: 'POST', body: form });

			if (msgRes.ok) {
				// Read SSE stream for assistant response
				let assistantContent = '';
				await readSSEStream(msgRes, {
					onToken(token) {
						assistantContent += token;
						messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantContent }];
					},
					onDone(data) {
						messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantContent, sources: data.sources }];
						isStreaming = false;
						goto(`/dashboard/c/${chatId}`);
					},
					onError(err) {
						messages = [...messages, { role: 'assistant', content: `Error: ${err}` }];
						isStreaming = false;
					}
				});
			} else {
				const err = await msgRes.text();
				messages = [...messages, { role: 'assistant', content: `Error: ${err}` }];
				isStreaming = false;
			}
		} catch (e: any) {
			messages = [...messages, { role: 'assistant', content: `Error: ${e.message}` }];
			isStreaming = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	{#if messages.length === 0}
		<div class="flex flex-1 flex-col items-center justify-center px-6">
			<EmptyChatState />
			<div class="mt-8 w-full max-w-3xl">
				<ChatInput onSend={send} disabled={isStreaming} />
			</div>
		</div>
	{:else}
		<div class="flex-1 overflow-y-auto px-6 py-6">
			<div class="mx-auto max-w-3xl space-y-6">
				{#each messages as msg}
					<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
						<div class="max-w-[80%] space-y-2">
							<div
								class="rounded-2xl px-4 py-3 text-sm {msg.role === 'user' ? 'bg-accent-primary text-white' : 'bg-white border border-border-subtle text-text-primary'}"
							>
								{msg.content}
							</div>
							{#if msg.sources && msg.sources.length > 0}
								<div class="flex flex-wrap gap-1.5">
									{#each msg.sources as source}
										<span class="rounded-full bg-bg-primary px-2 py-0.5 text-[10px] text-text-muted">{source.name}</span>
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<ChatInput onSend={send} disabled={isStreaming} />
	{/if}
</div>

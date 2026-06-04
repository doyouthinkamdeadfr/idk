<script lang="ts">
	import { page } from '$app/stores';
	import ChatInput from '$components/dashboard/ChatInput.svelte';
	import { readSSEStream } from '$lib/sse';

	let chatId = $derived($page.data.chatId as string);
	let messages = $state<Array<{role: 'user' | 'assistant', content: string, sources?: any[]}>>([]);
	let isStreaming = $state(false);
	let loaded = $state(false);

	// Load existing messages
	$effect(() => {
		if (chatId && !loaded) {
			fetch(`/api/chats/${chatId}/messages`).then(r => r.json()).then((data) => {
				messages = data.map((m: any) => ({
					role: m.role,
					content: m.content,
					sources: m.sources ? JSON.parse(m.sources) : undefined
				}));
				loaded = true;
			});
		}
	});

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
				// Read SSE stream
				let assistantContent = '';
				await readSSEStream(msgRes, {
					onToken(token) {
						assistantContent += token;
						messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantContent }];
					},
					onDone(data) {
						messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantContent, sources: data.sources }];
						isStreaming = false;
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
</div>

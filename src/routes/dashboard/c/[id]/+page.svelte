<script lang="ts">
	import { page } from '$app/stores';
	import ChatInput from '$components/dashboard/ChatInput.svelte';
	import { readSSEStream } from '$lib/sse';

	interface AttachmentInfo {
		type: string;
		name: string;
	}

	interface Msg {
		role: 'user' | 'assistant';
		content: string;
		sources?: any[];
		attachments?: AttachmentInfo[];
		placeholder?: boolean;
	}

	let chatId = $derived($page.data.chatId as string);
	let messages = $state<Msg[]>([]);
	let isStreaming = $state(false);
	let statusMessage = $state<string | null>(null);
	let loaded = $state(false);
	let scrollContainer: HTMLDivElement | undefined = $state();

	$effect(() => {
		messages;
		statusMessage;
		if (scrollContainer) {
			requestAnimationFrame(() => {
				scrollContainer!.scrollTop = scrollContainer!.scrollHeight;
			});
		}
	});

	// Load existing messages
	$effect(() => {
		if (chatId && !loaded) {
			fetch(`/api/chats/${chatId}/messages`).then(r => r.json()).then((data) => {
				messages = data.map((m: any) => ({
					role: m.role,
					content: m.content,
					sources: m.sources ? JSON.parse(m.sources) : undefined,
					attachments: m.attachments ? JSON.parse(m.attachments) : undefined
				}));
				loaded = true;
			});
		}
	});

	function getAttachmentEmoji(type: string): string {
		if (type === 'image') return '\u{1F5BC}';
		if (type === 'link') return '\u{1F517}';
		return '\u{1F4C4}';
	}

	function makeUserMsg(payload: { text: string; attachments: { type: string; name: string }[] }): Msg {
		return {
			role: 'user',
			content: payload.text || '(attachment only)',
			attachments: payload.attachments.length > 0 ? payload.attachments.map(a => ({ type: a.type, name: a.name })) : undefined
		};
	}

	async function send(payload: { text: string; attachments: { type: string; name: string; file?: File; url?: string; hash?: string }[] }) {
		isStreaming = true;

		messages = [...messages, makeUserMsg(payload)];
		messages = [...messages, { role: 'assistant', content: '', placeholder: true }];

		try {
			const form = new FormData();
			form.set('text', payload.text);
			if (payload.attachments.length > 0) {
				const files = payload.attachments.filter(a => a.file);
				const links = payload.attachments.filter(a => a.url).map(a => a.url);
				for (const f of files) {
					form.append('files[]', f.file!, f.name);
					form.append('hashes[]', f.hash ?? '');
				}
				if (links.length > 0) form.set('links', JSON.stringify(links));
			}

			const msgRes = await fetch(`/api/chats/${chatId}/messages`, { method: 'POST', body: form });

			if (msgRes.ok) {
				let assistantContent = '';
				await readSSEStream(msgRes, {
					onStatus(msg) {
						statusMessage = msg;
					},
					onToken(token) {
						assistantContent += token;
						messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantContent }];
					},
					onDone(data) {
						statusMessage = null;
						messages = [...messages.slice(0, -1), { role: 'assistant', content: assistantContent, sources: data.sources }];
						isStreaming = false;
					},
					onError(err) {
						statusMessage = null;
						messages = [...messages.slice(0, -1), { role: 'assistant', content: `Error: ${err}` }];
						isStreaming = false;
					}
				});
			} else {
				const err = await msgRes.text();
				messages = [...messages.slice(0, -1), { role: 'assistant', content: `Error: ${err}` }];
				isStreaming = false;
			}
		} catch (e: any) {
			messages = [...messages.slice(0, -1), { role: 'assistant', content: `Error: ${e.message}` }];
			isStreaming = false;
		}
	}
</script>

<div class="flex h-full flex-col">
	<div class="flex-1 overflow-y-auto px-6 py-6" bind:this={scrollContainer}>
		<div class="mx-auto max-w-3xl space-y-6">
			{#each messages as msg}
				<div class="flex {msg.role === 'user' ? 'justify-end' : 'justify-start'}">
					<div class="max-w-[80%] space-y-2">
						<div
							class="rounded-2xl px-4 py-3 text-sm {msg.role === 'user' ? 'bg-accent-primary text-white' : 'bg-white border border-border-subtle text-text-primary'}"
						>
							{#if msg.attachments && msg.attachments.length > 0}
								<div class="mb-2 flex flex-wrap gap-1.5">
									{#each msg.attachments as att}
										<span class="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-[11px]">
											{getAttachmentEmoji(att.type)}
											{att.name}
										</span>
									{/each}
								</div>
							{/if}
							{#if msg.content}
								{msg.content}
							{:else if msg.placeholder}
								<span class="italic opacity-50">Thinking...</span>
							{/if}
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

	{#if statusMessage}
		<div class="flex items-center justify-center gap-2 px-6 py-2 text-xs text-text-muted">
			<span class="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-primary"></span>
			{statusMessage}
		</div>
	{/if}

	<ChatInput onSend={send} disabled={isStreaming} />
</div>

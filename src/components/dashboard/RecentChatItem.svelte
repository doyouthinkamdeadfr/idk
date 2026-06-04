<script lang="ts">
	import ChatMenu from './ChatMenu.svelte';

	interface Props {
		chat: { id: string; title: string; pinned: number | boolean; archived: number | boolean };
		active: boolean;
		onPin: (id: string) => void;
		onArchive: (id: string) => void;
		onDelete: (id: string) => void;
		onShare: (id: string) => void;
	}

	let { chat, active, onPin, onArchive, onDelete, onShare }: Props = $props();

	function handleClick() {
		if (chat.archived) return;
		window.location.href = `/dashboard/c/${chat.id}`;
	}
</script>

<button
	onclick={handleClick}
	class="group flex w-full items-center gap-1.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors {active ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-primary hover:bg-bg-primary'} {chat.archived ? 'opacity-40' : ''}"
>
	{#if chat.pinned}
		<svg class="h-3 w-3 flex-shrink-0 text-text-muted" fill="currentColor" viewBox="0 0 20 20">
			<path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-5-3.5L5 21V5z" />
		</svg>
	{/if}
	<span class="flex-1 truncate">{chat.title}</span>
	<ChatMenu chatId={chat.id} pinned={chat.pinned} archived={chat.archived} {onPin} {onArchive} {onDelete} {onShare} />
</button>

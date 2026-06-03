<script lang="ts">
	import { page } from '$app/stores';
	import RecentChatItem from './RecentChatItem.svelte';
	import { mockChats } from '$lib/mock';

	interface Props {
		open: boolean;
		ontoggle: () => void;
	}

	let { open, ontoggle }: Props = $props();

	let user = $derived($page.data.session?.user);
	let userMenuOpen = $state(false);
	let moreMenuOpen = $state(false);
	let recents = $state([...mockChats]);

	let sortedRecents = $derived(
		recents
			.filter((c) => !c.archived)
			.sort((a, b) => {
				if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
				return b.updatedAt.getTime() - a.updatedAt.getTime();
			})
	);

	function closeAll() {
		userMenuOpen = false;
		moreMenuOpen = false;
	}

	function toggleUserMenu(e: MouseEvent) {
		e.stopPropagation();
		userMenuOpen = !userMenuOpen;
		moreMenuOpen = false;
	}

	function toggleMoreMenu(e: MouseEvent) {
		e.stopPropagation();
		moreMenuOpen = !moreMenuOpen;
		userMenuOpen = false;
	}

	function handleLogout() {
		window.location.href = '/auth/logout';
	}

	function handleUpgrade() {
		window.location.href = '/pricing';
	}

	function handleNewChat() {
		window.location.href = '/dashboard';
	}

	function togglePin(id: string) {
		recents = recents.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c));
	}

	function toggleArchive(id: string) {
		recents = recents.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c));
	}

	function deleteChat(id: string) {
		recents = recents.filter((c) => c.id !== id);
	}

	function shareChat(id: string) {
		// no-op for now
	}

	let currentPath = $derived($page.url.pathname);
	let activeChatId = $derived(currentPath.match(/\/dashboard\/c\/(.+)/)?.[1] ?? null);
	let isNewChat = $derived(currentPath === '/dashboard');
	let isDocuments = $derived(currentPath === '/dashboard/documents');
	let isProjects = $derived(currentPath === '/dashboard/projects');
	let isSettings = $derived(currentPath === '/dashboard/settings');
</script>

<svelte:window onclick={closeAll} />

<aside
	class="flex h-full flex-col border-r border-border-subtle bg-white overflow-hidden transition-all duration-300"
	class:w-14={!open}
	class:w-60={open}
	class:items-center={!open}
>
	{#if open}
		<div class="flex w-60 items-center justify-between px-4 py-3">
			<span class="text-base font-bold tracking-tight text-text-primary">Memory</span>
			<button onclick={ontoggle} class="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-primary transition-all">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
				</svg>
			</button>
		</div>

		<div class="w-60 flex-1 flex flex-col min-w-0">
			<div class="px-3">
				<button
					onclick={handleNewChat}
					class="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98] {isNewChat ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-dashed border-border-subtle text-text-muted hover:border-accent-primary hover:text-accent-primary'}"
				>
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
					</svg>
					New Chat
				</button>
			</div>

			<div class="mt-3 px-3">
				<div class="relative">
					<svg class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
					</svg>
					<input
						type="text"
						placeholder="Search chats..."
						class="w-full rounded-lg border border-border-subtle bg-bg-primary py-1.5 pl-8 pr-3 text-xs text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
					/>
				</div>
			</div>

			<nav class="mt-4 flex-1 overflow-y-auto px-3">
				<div class="space-y-0.5">
					<a
						href="/dashboard/documents"
						class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors {isDocuments ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-muted hover:text-text-primary hover:bg-bg-primary'}"
					>
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
						Library
					</a>
					<a
						href="/dashboard/projects"
						class="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs transition-colors {isProjects ? 'bg-accent-primary/10 text-accent-primary' : 'text-text-muted hover:text-text-primary hover:bg-bg-primary'}"
					>
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
						Projects
					</a>
					<div class="relative">
						<button
							onclick={toggleMoreMenu}
							class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors"
						>
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6h.01M6 12h.01M6 18h.01M12 6h.01M12 12h.01M12 18h.01M18 6h.01M18 12h.01M18 18h.01" /></svg>
							...more
						</button>
						{#if moreMenuOpen}
							<div class="absolute left-0 top-full z-50 mt-1 w-44 rounded-xl border border-border-subtle bg-white py-1 shadow-lg" onclick={(e) => e.stopPropagation()}>
								<button onclick={() => moreMenuOpen = false} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
									<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
									Archived chats
								</button>
								<button onclick={() => moreMenuOpen = false} class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
									<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
									Images
								</button>
							</div>
						{/if}
					</div>
				</div>

				<div class="mt-6 mb-4">
					<div class="flex items-center justify-between px-2.5 py-1">
						<span class="text-xs font-semibold tracking-wider text-text-muted uppercase">Recents</span>
					</div>
					<div class="mt-1 space-y-0.5">
						{#each sortedRecents as chat (chat.id)}
							<RecentChatItem
								chat={chat}
								active={activeChatId === chat.id}
								onPin={togglePin}
								onArchive={toggleArchive}
								onDelete={deleteChat}
								onShare={shareChat}
							/>
						{/each}
					</div>
				</div>
			</nav>

			<div class="border-t border-border-subtle">
				<div class="relative px-3 py-3">
					<button onclick={toggleUserMenu} class="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-bg-primary transition-colors">
						<div class="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary/10 text-xs font-bold text-accent-primary">
							{user?.name?.charAt(0)?.toUpperCase() || '?'}
						</div>
						<div class="flex flex-1 items-center justify-between min-w-0">
							<span class="truncate text-sm font-medium text-text-primary">{user?.name || 'User'}</span>
							<svg class="h-3.5 w-3.5 flex-shrink-0 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</button>

					<div class="absolute right-3 top-3.5">
						<button onclick={handleUpgrade} class="rounded-full bg-accent-primary px-3 py-0.5 text-[11px] font-semibold text-white hover:bg-accent-primary/90 transition-colors">
							Upgrade
						</button>
					</div>

					{#if userMenuOpen}
						<div class="absolute bottom-full left-2 right-2 mb-1 rounded-xl border border-border-subtle bg-white p-1.5 shadow-lg" onclick={(e) => e.stopPropagation()}>
							<button onclick={() => { userMenuOpen = false; window.location.href = '/pricing'; }} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
								<svg class="h-3.5 w-3.5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
								Upgrade plan
							</button>
							<button onclick={() => userMenuOpen = false} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
								<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1112 21v-4.5H9.5A4.5 4.5 0 015.121 17.804z" /></svg>
								Personalization
							</button>
							<a href="/dashboard/settings" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
								<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
								Profile settings
							</a>
							<button onclick={() => userMenuOpen = false} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
								<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
								Help
							</button>
							<div class="my-1 border-t border-border-subtle"></div>
							<button onclick={handleLogout} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
								<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
								Log out
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-3 py-3">
			<button onclick={ontoggle} class="flex h-6 w-6 items-center justify-center rounded text-text-muted hover:text-text-primary hover:bg-bg-primary transition-all">
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
				</svg>
			</button>
		</div>

		<button onclick={handleNewChat} class="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-border-subtle text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all">
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</button>

		<button class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-primary transition-all">
			<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
			</svg>
		</button>

		<div class="flex-1"></div>

		<div class="relative pb-3">
			<button onclick={toggleUserMenu} class="flex h-7 w-7 items-center justify-center rounded-full bg-accent-primary/10 text-xs font-bold text-accent-primary">
				{user?.name?.charAt(0)?.toUpperCase() || '?'}
			</button>

			{#if userMenuOpen}
				<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 rounded-xl border border-border-subtle bg-white py-1 shadow-lg" onclick={(e) => e.stopPropagation()}>
					<button onclick={() => { userMenuOpen = false; window.location.href = '/pricing'; }} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
						Upgrade plan
					</button>
					<button onclick={() => userMenuOpen = false} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1112 21v-4.5H9.5A4.5 4.5 0 015.121 17.804z" /></svg>
						Personalization
					</button>
					<a href="/dashboard/settings" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
						Profile settings
					</a>
					<button onclick={() => userMenuOpen = false} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
						Help
					</button>
					<div class="my-1 border-t border-border-subtle"></div>
					<button onclick={handleLogout} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors">
						<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
						Log out
					</button>
				</div>
			{/if}
		</div>
	{/if}
</aside>

<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let user = $derived($page.data.session?.user);
	let userMenuOpen = $state(false);

	function toggleUserMenu(e: MouseEvent) {
		e.stopPropagation();
		userMenuOpen = !userMenuOpen;
	}

	function closeMenu() {
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
</script>

<svelte:window onclick={closeMenu} />

<aside class="flex h-full w-60 flex-col border-r border-border-subtle bg-white">
	<div class="flex items-center justify-between px-4 py-3">
		<span class="text-base font-bold tracking-tight text-text-primary">Memory</span>
	</div>

	<div class="px-3">
		<button
			onclick={handleNewChat}
			class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border-subtle px-3 py-2 text-sm font-medium text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-[0.98]"
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
		<div class="mb-2">
			<button class="flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold tracking-wider text-text-muted uppercase hover:text-text-primary transition-colors">
				<span>Library</span>
				<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>

		<div class="mb-4">
			<div class="flex items-center justify-between px-2.5 py-1">
				<span class="text-xs font-semibold tracking-wider text-text-muted uppercase">Recents</span>
				<button class="text-xs text-accent-primary hover:underline">Create group</button>
			</div>
			<div class="mt-1 space-y-0.5">
				<div class="rounded-lg px-2.5 py-2 text-xs text-text-muted">No recent chats</div>
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

			<div class="absolute right-3 top-1.5">
				<button onclick={handleUpgrade} class="rounded-full bg-accent-primary px-2.5 py-0.5 text-[10px] font-semibold text-white hover:bg-accent-primary/90 transition-colors">
					Upg
				</button>
			</div>

			{#if userMenuOpen}
				<div class="absolute bottom-full left-2 right-2 mb-1 rounded-xl border border-border-subtle bg-white p-1.5 shadow-lg" onclick={(e) => e.stopPropagation()}>
					<button onclick={() => { closeMenu(); window.location.href = '/pricing'; }} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-accent-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
						Upgrade plan
					</button>
					<button onclick={closeMenu} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A9 9 0 1112 21v-4.5H9.5A4.5 4.5 0 015.121 17.804z" /></svg>
						Personalization
					</button>
					<a href="/dashboard/settings" class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
						<svg class="h-3.5 w-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
						Profile settings
					</a>
					<button onclick={closeMenu} class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-text-primary hover:bg-bg-primary transition-colors">
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
</aside>

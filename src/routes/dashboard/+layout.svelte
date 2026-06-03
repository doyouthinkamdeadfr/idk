<script lang="ts">
	import Sidebar from '$components/dashboard/Sidebar.svelte';
	import TopBar from '$components/dashboard/TopBar.svelte';

	let { children } = $props();

	let sidebarOpen = $state(true);

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	function handleNewChat() {
		window.location.href = '/dashboard';
	}
</script>

<div class="flex h-screen overflow-hidden bg-bg-primary">
	<Sidebar open={sidebarOpen} ontoggle={toggleSidebar} />
	<div class="flex flex-1 flex-col min-w-0">
		<TopBar />
		<main class="flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>
	<nav class="flex w-10 flex-col items-center border-l border-border-subtle bg-white py-3">
		<button
			onclick={handleNewChat}
			class="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-accent-primary hover:bg-bg-primary transition-all"
		>
			<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
			</svg>
		</button>
	</nav>
</div>

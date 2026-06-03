<script lang="ts">
	import Sidebar from '$components/dashboard/Sidebar.svelte';
	import TopBar from '$components/dashboard/TopBar.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen overflow-hidden bg-bg-primary">
	<Sidebar />
	<div class="flex flex-1 flex-col min-w-0">
		<TopBar />
		<main class="flex-1 overflow-y-auto">
			{@render children()}
		</main>
	</div>
</div>

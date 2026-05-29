<script lang="ts">
	import './layout.css';
	import Navbar from '$components/layout/Navbar.svelte';

	let { children } = $props();
</script>

<Navbar />

<main>
	{@render children()}
</main>

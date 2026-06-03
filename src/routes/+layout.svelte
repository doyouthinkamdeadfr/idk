<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import { page, navigating } from '$app/stores';
	import Navbar from '$components/layout/Navbar.svelte';
	import ProgressBar from '$components/ui/ProgressBar.svelte';
	import PageLoader from '$components/ui/PageLoader.svelte';
	import { initScroll, destroyScroll, activeSection } from '$lib/scroll';

	let { children } = $props();

	let isDashboard = $derived($page.url.pathname.startsWith('/dashboard'));

	const sectionBgs = [
		'var(--color-bg-primary)',
		'var(--color-bg-alt)',
		'var(--color-bg-warm)',
		'var(--color-bg-primary)',
		'var(--color-bg-warm)',
		'var(--color-bg-primary)',
		'var(--color-bg-warm)'
	];

	let bgStyle = $state(sectionBgs[0]);

	onMount(() => {
		document.getElementById('skeleton-loader')?.classList.add('hidden');

		if (isDashboard) return;

		initScroll();

		const unsub = activeSection.subscribe((idx) => {
			const i = Math.min(idx, sectionBgs.length - 1);
			bgStyle = sectionBgs[i];
		});

		return () => {
			unsub();
			destroyScroll();
		};
	});
</script>

<div class="fixed inset-0 -z-10 transition-colors duration-700" style="background: {isDashboard ? '#f7f5f0' : bgStyle}"></div>

{#if $navigating}
	<PageLoader />
{/if}

{#if !isDashboard}
	<ProgressBar />
	<Navbar />
{/if}

<main>
	{@render children()}
</main>

<script lang="ts">
	import './layout.css';
	import { onMount } from 'svelte';
	import Navbar from '$components/layout/Navbar.svelte';
	import ProgressBar from '$components/ui/ProgressBar.svelte';
	import { initScroll, destroyScroll, activeSection } from '$lib/scroll';

	let { children } = $props();

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

<div class="fixed inset-0 -z-10 transition-colors duration-700" style="background: {bgStyle}"></div>

<ProgressBar />
<Navbar />

<main>
	{@render children()}
</main>

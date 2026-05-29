<script lang="ts">
	import { onMount } from 'svelte';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

	let { value = 0, suffix = '', prefix = '', duration = 1200, class: className = '' } = $props();

	let el: HTMLDivElement;
	let started = $state(false);

	const count = tweened(0, {
		duration: 1200,
		easing: cubicOut
	});

	onMount(() => {
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started) {
					started = true;
					$count = value;
					obs.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		obs.observe(el);
		return () => obs.disconnect();
	});
</script>

<div bind:this={el} class={className}>
	{$count < 1 ? '0' : `${prefix}${Math.round($count).toLocaleString()}${suffix}`}
</div>

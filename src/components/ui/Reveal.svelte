<script lang="ts">
	import { onMount } from 'svelte';

	let { threshold = 0.2, class: className = '', children } = $props();

	let el: HTMLDivElement;
	let visible = $state(false);

	onMount(() => {
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					obs.disconnect();
				}
			},
			{ threshold }
		);
		obs.observe(el);
		return () => obs.disconnect();
	});
</script>

<div
	bind:this={el}
	class={className}
	style="opacity: {visible ? 1 : 0}; transform: translateY({visible
		? 0
		: '24px'}); transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);"
>
	{@render children()}
</div>

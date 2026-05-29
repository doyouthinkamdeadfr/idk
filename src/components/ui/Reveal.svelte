<script lang="ts">
	let { progress = 0, stagger = 0, class: className = '', children } = $props();

	let p = $derived.by(() => {
		if (stagger >= 1) return 0;
		return Math.max(0, Math.min(1, (progress - stagger) / (1 - stagger)));
	});

	let opacity = $derived(Math.sin(p * Math.PI));
	let translateY = $derived(12 - 24 * p);
</script>

<div class={className} style="opacity: {opacity}; transform: translateY({translateY}px);">
	{@render children()}
</div>

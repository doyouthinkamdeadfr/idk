<script lang="ts">
	let { glowColor = '232, 99, 74', class: className = '', children } = $props();

	let el: HTMLDivElement;
	let rotateX = $state(0);
	let rotateY = $state(0);
	let glareX = $state(50);
	let glareY = $state(50);

	function onPointerMove(e: PointerEvent) {
		const rect = el.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const cx = rect.width / 2;
		const cy = rect.height / 2;
		rotateX = ((y - cy) / cy) * -8;
		rotateY = ((x - cx) / cx) * 8;
		glareX = (x / rect.width) * 100;
		glareY = (y / rect.height) * 100;
	}

	function onPointerLeave() {
		rotateX = 0;
		rotateY = 0;
		glareX = 50;
		glareY = 50;
	}
</script>

<div
	bind:this={el}
	class={className}
	role="none"
	style="transform: perspective(600px) rotateX({rotateX}deg) rotateY({rotateY}deg); transition: transform 0.15s ease;"
	onpointermove={onPointerMove}
	onpointerleave={onPointerLeave}
>
	{@render children()}
	<div
		class="pointer-events-none absolute inset-0 rounded-[inherit]"
		style="background: radial-gradient(circle at {glareX}% {glareY}%, rgba({glowColor}, 0.12) 0%, transparent 60%);"
	></div>
</div>

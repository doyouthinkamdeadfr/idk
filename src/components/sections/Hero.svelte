<script lang="ts">
	import { onMount } from 'svelte';
	import { HeroCanvas } from '$components/canvas/HeroCanvas';

	let { sectionProgress = 0 } = $props();

	let canvasEl: HTMLCanvasElement;
	let canvasInstance: HeroCanvas;
	let headlineEl: HTMLSpanElement;

	onMount(() => {
		canvasInstance = new HeroCanvas(canvasEl);

		const chars = headlineEl.querySelectorAll('.char');
		chars.forEach((char, i) => {
			(char as HTMLElement).style.animation =
				`slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.03 + 0.3}s both`;
		});

		return () => canvasInstance.destroy();
	});
</script>

<section class="relative flex min-h-screen w-full items-center overflow-hidden bg-bg-primary">
	<div class="pointer-events-none absolute inset-0">
		<canvas bind:this={canvasEl} class="h-full w-full opacity-60"></canvas>
	</div>

	<div class="relative z-10 mx-auto w-full max-w-6xl px-8 md:px-16">
		<p
			class="text-xs font-semibold tracking-[0.2em] text-accent-primary uppercase"
			style="animation: slideUp 0.5s ease 0.1s both;"
		>
			Supermemory
		</p>
		<h1
			class="mt-6 max-w-4xl text-5xl leading-tight font-bold tracking-tight md:text-7xl lg:text-8xl"
		>
			<span bind:this={headlineEl} class="inline">
				{@html 'Answers from your data.'
					.split('')
					.map(
						(c) =>
							`<span class="char inline-block" style="opacity:0">${c === ' ' ? '&nbsp;' : c}</span>`
					)
					.join('')}
			</span><br />
			<span class="text-accent-primary">
				{@html 'In milliseconds.'
					.split('')
					.map(
						(c) =>
							`<span class="char inline-block" style="opacity:0">${c === ' ' ? '&nbsp;' : c}</span>`
					)
					.join('')}
			</span>
		</h1>
		<p
			class="mt-6 max-w-xl text-lg leading-relaxed text-text-muted md:text-xl"
			style="animation: slideUp 0.5s ease 0.6s both;"
		>
			Instantly retrieve, augment, and generate answers grounded in your documents, code, and
			knowledge base.
		</p>
		<div
			class="mt-10 flex flex-wrap items-center gap-4"
			style="animation: slideUp 0.5s ease 0.8s both;"
		>
			<a
				href="#cta"
				class="group relative inline-block rounded-full bg-accent-primary px-8 py-3 text-sm font-semibold text-white transition-all duration-200 active:scale-95"
			>
				<span class="relative z-10">Get Early Access</span>
				<span
					class="absolute inset-0 rounded-full bg-accent-primary opacity-0 transition-all duration-300 group-hover:opacity-100"
					style="filter: blur(12px);"
				></span>
			</a>
			<a
				href="#how-it-works"
				class="inline-block rounded-full border border-text-muted/30 px-8 py-3 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
			>
				See How It Works
			</a>
		</div>
	</div>

	<div
		class="absolute bottom-10 left-1/2 -translate-x-1/2"
		style="animation: fadeIn 0.8s ease 1.2s both;"
	>
		<div class="flex flex-col items-center gap-2">
			<span class="text-[10px] tracking-[0.25em] text-text-muted uppercase">Scroll</span>
			<div class="h-8 w-px bg-gradient-to-b from-accent-primary to-transparent"></div>
		</div>
	</div>
</section>

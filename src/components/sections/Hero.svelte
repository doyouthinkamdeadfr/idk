<script lang="ts">
	import { onMount } from 'svelte';
	import { HeroCanvas } from '$components/canvas/HeroCanvas';

	let canvasEl: HTMLCanvasElement;
	let canvasInstance: HeroCanvas;

	onMount(() => {
		canvasInstance = new HeroCanvas(canvasEl);
		return () => canvasInstance.destroy();
	});
</script>

<section
	class="relative flex min-h-screen w-full items-center overflow-hidden px-6 pt-24 md:px-10 lg:pt-28"
>
	<div class="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
		<div class="z-10">
			<h1
				class="text-4xl leading-tight font-bold tracking-tight text-text-primary md:text-5xl lg:text-6xl"
			>
				Answers from your data.
				<span class="text-accent-primary">In milliseconds.</span>
			</h1>
			<p class="mt-4 max-w-lg text-lg leading-relaxed text-text-muted md:text-xl">
				Supermemory instantly retrieves, augments, and generates answers grounded in your documents,
				code, and knowledge base.
			</p>
			<div class="mt-8 flex flex-wrap items-center gap-4">
				<a
					href="#cta"
					class="inline-block rounded-full bg-accent-primary px-8 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-accent-primary/90 active:scale-95"
				>
					Get Early Access
				</a>
				<a
					href="#how-it-works"
					class="inline-block rounded-full border border-border-subtle px-8 py-3 text-sm font-semibold text-text-muted transition-all duration-200 hover:border-accent-primary hover:text-accent-primary active:scale-95"
				>
					See How It Works
				</a>
			</div>
		</div>

		<div class="relative z-10 aspect-square w-full max-w-lg justify-self-end lg:aspect-[4/3]">
			<canvas
				bind:this={canvasEl}
				class="h-full w-full rounded-2xl border border-border-subtle bg-white shadow-lg"
				style="max-width: 100%;"
			></canvas>
			<div
				class="pointer-events-none absolute -top-3 -right-3 -bottom-3 -left-3 rounded-2xl bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5"
			></div>
		</div>
	</div>

	<div class="absolute bottom-8 left-1/2 -translate-x-1/2">
		<div class="flex flex-col items-center gap-2">
			<span class="text-xs tracking-[0.2em] text-text-muted uppercase">Scroll</span>
			<div class="h-8 w-px bg-gradient-to-b from-accent-primary to-transparent"></div>
		</div>
	</div>
</section>

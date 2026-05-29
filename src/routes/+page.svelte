<script lang="ts">
	import { scrollY } from '$lib/scroll';
	import Hero from '$components/sections/Hero.svelte';
	import Problem from '$components/sections/Problem.svelte';
	import Solution from '$components/sections/Solution.svelte';
	import HowItWorks from '$components/sections/HowItWorks.svelte';
	import Benchmarks from '$components/sections/Benchmarks.svelte';
	import Pricing from '$components/sections/Pricing.svelte';
	import CTA from '$components/sections/CTA.svelte';
	import Footer from '$components/layout/Footer.svelte';

	let vh = $derived(typeof window !== 'undefined' ? window.innerHeight : 900);

	let p0 = $derived(Math.max(0, Math.min(1, ($scrollY + vh) / (2 * vh))));
	let p1 = $derived(Math.max(0, Math.min(1, $scrollY / (2 * vh))));
	let p2 = $derived(Math.max(0, Math.min(1, ($scrollY - vh) / (2 * vh))));
	let p3 = $derived(Math.max(0, Math.min(1, ($scrollY - 2 * vh) / (2 * vh))));
	let p4 = $derived(Math.max(0, Math.min(1, ($scrollY - 3 * vh) / (2 * vh))));
	let p5 = $derived(Math.max(0, Math.min(1, ($scrollY - 4 * vh) / (2 * vh))));
	let p6 = $derived(Math.max(0, Math.min(1, ($scrollY - 5 * vh) / (2 * vh))));
	let p7 = $derived(Math.max(0, Math.min(1, ($scrollY - 6 * vh) / (2 * vh))));
</script>

<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #f7f5f0; z-index: 1"
	data-section="0"
>
	<Hero sectionProgress={p0} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #f0ece4; z-index: 2"
	data-section="1"
>
	<Problem sectionProgress={p1} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #faf2ea; z-index: 3"
	data-section="2"
>
	<Solution sectionProgress={p2} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #f7f5f0; z-index: 4"
	data-section="3"
>
	<HowItWorks sectionProgress={p3} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #faf2ea; z-index: 5"
	data-section="4"
>
	<Benchmarks sectionProgress={p4} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #f7f5f0; z-index: 6"
	data-section="5"
>
	<Pricing sectionProgress={p5} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #faf2ea; z-index: 7"
	data-section="6"
>
	<CTA sectionProgress={p6} />
</section>
<section
	class="sticky top-0 h-screen w-full overflow-hidden"
	style="background: #f7f5f0; z-index: 8"
	data-section="7"
>
	<Footer />
</section>

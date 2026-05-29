import { writable } from 'svelte/store';
import Lenis from 'lenis';

export const scrollY = writable(0);
export const activeSection = writable(0);
export const sectionProgress = writable(0);
export const scrollProgress = writable(0);
export const scrollVelocity = writable(0);

let lenis: Lenis;

export function initScroll() {
	lenis = new Lenis({
		duration: 1.1,
		lerp: 0.08,
		easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
		wheelMultiplier: 0.9,
		touchMultiplier: 1.2
	});

	lenis.on('scroll', ({ progress, velocity }) => {
		scrollProgress.set(progress);
		scrollY.set(lenis.scroll);
		scrollVelocity.set(Math.abs(velocity));

		const sections = document.querySelectorAll('[data-section]');
		const vh = window.innerHeight;
		const sy = lenis.scroll;

		let current = 0;
		for (let i = 0; i < sections.length; i++) {
			const section = sections[i];
			const sectionTop = (section as HTMLElement).offsetTop;
			const sectionBottom = sectionTop + vh;
			if (sy >= sectionTop - vh / 2 && sy < sectionBottom - vh / 2) {
				current = i;
				break;
			}
			if (i === sections.length - 1 && sy >= sectionBottom - vh / 2) {
				current = i;
			}
		}
		activeSection.set(current);
		sectionProgress.set(Math.max(0, Math.min(1, (sy - current * vh) / vh)));
	});

	const raf = (time: number) => {
		lenis.raf(time);
		requestAnimationFrame(raf);
	};
	requestAnimationFrame(raf);

	return lenis;
}

export function destroyScroll() {
	if (lenis) lenis.destroy();
}

export function scrollToSection(idx: number) {
	if (lenis) lenis.scrollTo(idx * window.innerHeight);
}

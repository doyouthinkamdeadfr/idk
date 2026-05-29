export function parallax(node: HTMLElement, speed: number = 0.3) {
	let ticking = false;

	function apply() {
		const rect = node.getBoundingClientRect();
		const viewportCenter = window.innerHeight / 2;
		const elementCenter = rect.top + rect.height / 2;
		const offset = (viewportCenter - elementCenter) * speed;
		node.style.transform = `translateY(${offset}px)`;
		ticking = false;
	}

	function handleScroll() {
		if (!ticking) {
			requestAnimationFrame(apply);
			ticking = true;
		}
	}

	node.style.willChange = 'transform';
	window.addEventListener('scroll', handleScroll, { passive: true });
	apply();

	return {
		update(newSpeed: number) {
			speed = newSpeed;
		},
		destroy() {
			window.removeEventListener('scroll', handleScroll);
		}
	};
}

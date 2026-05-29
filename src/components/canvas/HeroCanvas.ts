interface Node {
	x: number;
	y: number;
	vx: number;
	vy: number;
	connections: number[];
	pulse: number;
}

export class HeroCanvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;
	nodes: Node[] = [];
	raf!: number;
	mouseX = 0.5;
	mouseY = 0.5;
	time = 0;

	constructor(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d')!;
		this.resize();
		this.initNodes();
		this.bind();
		this.tick(0);
	}

	resize = () => {
		const dpr = Math.min(window.devicePixelRatio, 2);
		const w = this.canvas.clientWidth;
		const h = this.canvas.clientHeight;
		this.canvas.width = w * dpr;
		this.canvas.height = h * dpr;
		this.ctx.scale(dpr, dpr);
	};

	initNodes = () => {
		const w = this.canvas.clientWidth;
		const h = this.canvas.clientHeight;
		this.nodes = [];
		const count = Math.min(30, Math.floor((w * h) / 20000));

		for (let i = 0; i < count; i++) {
			const n: Node = {
				x: Math.random() * w,
				y: Math.random() * h,
				vx: (Math.random() - 0.5) * 0.3,
				vy: (Math.random() - 0.5) * 0.3,
				connections: [],
				pulse: Math.random() * Math.PI * 2
			};
			n.connections = [];
			for (let j = 0; j < i; j++) {
				if (j !== i && Math.random() > 0.7) {
					n.connections.push(j);
				}
			}
			this.nodes.push(n);
		}
	};

	bind = () => {
		window.addEventListener('resize', this.resize);
		this.canvas.addEventListener('mousemove', (e) => {
			const rect = this.canvas.getBoundingClientRect();
			this.mouseX = (e.clientX - rect.left) / rect.width;
			this.mouseY = (e.clientY - rect.top) / rect.height;
		});
	};

	tick = (time: number) => {
		this.raf = requestAnimationFrame(this.tick);
		this.time = time;
		this.draw();
	};

	draw = () => {
		const { ctx } = this;
		const w = this.canvas.clientWidth;
		const h = this.canvas.clientHeight;

		ctx.clearRect(0, 0, w, h);

		const mx = this.mouseX * w;
		const my = this.mouseY * h;

		for (const n of this.nodes) {
			n.x += n.vx + ((mx - w / 2) * 0.0002 * (n.x - mx)) / Math.max(w, 1);
			n.y += n.vy + ((my - h / 2) * 0.0002 * (n.y - my)) / Math.max(h, 1);
			n.pulse += 0.02;

			if (n.x < 0 || n.x > w) n.vx *= -1;
			if (n.y < 0 || n.y > h) n.vy *= -1;
			n.x = Math.max(0, Math.min(w, n.x));
			n.y = Math.max(0, Math.min(h, n.y));
		}

		for (const n of this.nodes) {
			for (const ci of n.connections) {
				const target = this.nodes[ci];
				if (!target) continue;
				const dx = target.x - n.x;
				const dy = target.y - n.y;
				const dist = Math.sqrt(dx * dx + dy * dy);
				if (dist > 250) continue;

				const alpha = 1 - dist / 250;
				ctx.beginPath();
				ctx.moveTo(n.x, n.y);
				ctx.lineTo(target.x, target.y);
				ctx.strokeStyle = `rgba(232, 99, 74, ${alpha * 0.25})`;
				ctx.lineWidth = 1;
				ctx.stroke();

				const pulseAlpha = (Math.sin(n.pulse) * 0.5 + 0.5) * alpha;
				const px = n.x + dx * 0.5;
				const py = n.y + dy * 0.5;
				ctx.beginPath();
				ctx.arc(px, py, 2, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(232, 99, 74, ${pulseAlpha * 0.6})`;
				ctx.fill();
			}
		}

		for (const n of this.nodes) {
			const pulseSize = Math.sin(n.pulse) * 0.5 + 0.5;

			ctx.beginPath();
			ctx.arc(n.x, n.y, 3 + pulseSize * 2, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(232, 99, 74, ${0.5 + pulseSize * 0.3})`;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(n.x, n.y, 6 + pulseSize * 4, 0, Math.PI * 2);
			ctx.fillStyle = `rgba(232, 99, 74, ${0.06 + pulseSize * 0.06})`;
			ctx.fill();
		}
	};

	destroy = () => {
		cancelAnimationFrame(this.raf);
		window.removeEventListener('resize', this.resize);
	};
}

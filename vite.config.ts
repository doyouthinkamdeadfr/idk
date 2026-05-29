import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			'$components': path.resolve('./src/components')
		}
	},
	server: {
		watch: {
			usePolling: true,
			interval: 500,
		},
		hmr: true,
	}
});

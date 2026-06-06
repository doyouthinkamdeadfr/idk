import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
	resolve: {
		alias: {
			$components: path.resolve('./src/components'),
			$lib: path.resolve('./src/lib'),
			$db: path.resolve('./src/db')
		}
	},
	test: {
		environment: 'jsdom',
		globals: true,
		include: ['src/**/*.{test,spec}.{ts,js}']
	}
});

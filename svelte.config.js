import adapter from '@sveltejs/adapter-cloudflare';

const config = {
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components'
		}
	}
};

export default config;

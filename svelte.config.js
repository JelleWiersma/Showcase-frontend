import cfAdapter from '@sveltejs/adapter-cloudflare';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Use Cloudflare adapter only in production
        adapter: process.env.NODE_ENV === 'production' ? cfAdapter() : adapter(),
	}
};

export default config;

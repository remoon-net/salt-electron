import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: 'salt.lo.remoon.net',
	},
	resolve: {
		alias: {
			bootstrap: path.resolve(__dirname, 'node_modules', 'bootstrap'),
		},
	},
})

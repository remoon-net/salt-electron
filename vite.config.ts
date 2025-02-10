import { sveltekit } from '@sveltejs/kit/vite'
import path from 'path'
import { defineConfig } from 'vite'

const faker = path.resolve('./node_modules/@remoon.net/bootstrap/faker.js')

export default defineConfig({
	build: {
		target: 'es2015',
	},
	plugins: [sveltekit()],
	server: {
		host: 'salt-vpn.lo.remoon.net',
	},
	resolve: {
		alias: [
			{
				find: 'bootstrap',
				replacement: path.resolve('./node_modules/bootstrap'),
				customResolver(source, importer, options) {
					if (source.endsWith('ss')) {
						return
					}
					// @ts-ignore
					if (options.ssr) {
						return faker
					}
				},
			},
		],
	},
})

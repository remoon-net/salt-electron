import { browser } from '$app/environment'
import type { Status } from '$lib/config.js'
import xhe from '$lib/xhe'

export async function load({ url }) {
	if (!browser) {
		return {} as never
	}
	return {
		linker: url.searchParams.has('linker') ? url.searchParams.get('linker') : null,
	}
}

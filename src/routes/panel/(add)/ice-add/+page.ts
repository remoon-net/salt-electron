import { browser } from '$app/environment'
import type { Status } from '$lib/config.js'
import xhe from '$lib/xhe'

export async function load({ url }) {
	if (!browser) {
		return {} as never
	}
	const s = await xhe.get('status')
	const status = JSON.parse(s) as Status
	let ice = ''
	if (url.searchParams.has('index')) {
		let index = Number(url.searchParams.get('index'))
		ice = status.ICE[index]
	}
	return {
		tags: status.ICETags.filter((s) => !['direct', 'nowsc'].includes(s)),
		ice: ice,
		index: url.searchParams.has('index') ? url.searchParams.get('index') : null,
	}
}

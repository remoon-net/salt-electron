import type { Status } from '$lib/config'
import xhe from '$lib/xhe'

export async function load() {
	const s = await xhe.get('status')
	const status = JSON.parse(s) as Status
	return {
		status,
	}
}

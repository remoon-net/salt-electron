import type { Status } from '$lib/config'
import xhe from '$lib/xhe'

export async function load() {
	const s = await xhe.get('status')
	const status = JSON.parse(s) as Status
	const ips = JSON.parse(await xhe.get('nat_next_ips')) as string[]
	return {
		status,
		ips,
	}
}

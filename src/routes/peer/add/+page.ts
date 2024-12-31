import type { Peer, Status } from '$lib/config'
import xhe from '$lib/xhe'

export async function load({ url }) {
	const s = await xhe.get('status')
	const status = JSON.parse(s) as Status
	const ips = JSON.parse(await xhe.get('nat_next_ips')) as string[]
	let peer: Peer | null = null
	if (url.searchParams.has('import')) {
		let s = sessionStorage.getItem('temp-import-peer')
		if (typeof s === 'string') {
			peer = JSON.parse(s)
		}
	}
	return {
		status,
		ips,
		peer,
	}
}

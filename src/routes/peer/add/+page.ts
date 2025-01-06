import type { Peer, Status } from '$lib/config'
import xhe from '$lib/xhe'
import { redirect } from '@sveltejs/kit'

export async function load({ url }) {
	const s = await xhe.get('status')
	const status = JSON.parse(s) as Status
	const ips = JSON.parse(await xhe.get('nat_next_ips')) as string[]
	let peer: Peer | null = null
	if (url.searchParams.get('peer') === 'share') {
		try {
			let s = await xhe.get('peer.share.decoded')
			peer = JSON.parse(s)
		} catch {
			redirect(307, '/')
		}
	}
	return {
		status,
		ips,
		peer,
	}
}

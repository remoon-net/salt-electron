import { browser } from '$app/environment'
import type { Peer, Status } from '$lib/config'

import { status } from '$lib/fake.data'
import { redirect } from '@sveltejs/kit'
import xhe from '$lib/xhe.js'

export async function load({ url }) {
	if (!browser) {
		return {} as never
	}
	const status = JSON.parse(await xhe.get('status')) as Status
	const pubkey = url.searchParams.get('pubkey')
	let p: Peer
	for (let peer of status.Peer) {
		if (peer.Pubkey == pubkey) {
			p = peer
		}
	}
	// @ts-ignore
	if (!p) {
		redirect(307, '/')
	}
	return {
		peer: p,
		status: status,
	}
}

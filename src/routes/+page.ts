import type { Status } from '$lib/config'
import { status } from '$lib/fake.data'
import xhe from '$lib/xhe'

export async function load({ depends, parent }) {
	await parent()
	depends('app:status')
	let s = await xhe.get('status')
	let status: Status = JSON.parse(s)
	return {
		status,
	}
}

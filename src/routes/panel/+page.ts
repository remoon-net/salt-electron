import type { Config } from '$lib/config'
import { status } from '$lib/fake.data'

export function load() {
	return {
		status: status,
	}
}

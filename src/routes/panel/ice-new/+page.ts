import { browser } from '$app/environment'

export function load({}) {
	if (!browser) {
		return {} as never
	}
	return {
		tags: ['direct', 'relay', 'custom'],
	}
}

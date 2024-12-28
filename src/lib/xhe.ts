import { registerPlugin } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'

export const enum Target {
	None = 0b00,
	Device = 0b10,
	Linker = 0b01,
	All = 0b11,
}

export interface XhePluginNative {
	start(options: { target: Target }): Promise<void>
	stop(options: { target: Target }): Promise<void>
	set(options: { selector: string; action: string; value: string }): Promise<void>
	get(options: { selector: string }): Promise<{ value: string }>
}

export interface XhePlugin {
	start(target: Target): Promise<void>
	stop(target: Target): Promise<void>
	set(selector: string, action: string, raw: string): Promise<void>
	get(selector: string): Promise<string>
}

import { browser } from '$app/environment'

const Xhe = registerPlugin<XhePluginNative>('Xhe', {
	web: import('./xhe-web').then(({ load }) => (browser ? load() : null)),
})

export async function save() {
	let s = await Xhe.get({ selector: 'status' }).then((r) => r.value)
	await Preferences.set({
		key: 'config',
		value: s,
	})
}

export async function load() {
	let { value } = await Preferences.get({ key: 'config' })
	if (!value) {
		return
	}
	return Xhe.set({
		selector: 'settings',
		action: '',
		value: value,
	})
}

let initLoadConfig = browser ? load() : null

const xhe: XhePlugin = {
	start: async (target: Target) => {
		await initLoadConfig
		await save()
		return Xhe.start({ target })
	},
	stop: async (target: Target) => {
		return Xhe.stop({ target })
	},
	set: async function set(selector: string, action: string, raw: string) {
		let r = await Xhe.set({ selector, action, value: raw })
		await save()
		return r
	},
	get: async (selector: string) => {
		await initLoadConfig
		return Xhe.get({ selector }).then((r) => r.value)
	},
}

export default xhe

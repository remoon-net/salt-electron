import Store from 'electron-store'

import { PluginMethod, CapacitorPlugin } from 'cap-electron'

const store = new Store()

@CapacitorPlugin()
class Preferences {
	@PluginMethod()
	async set(opts: { key: string; value: string }) {
		store.set(opts.key, opts.value)
	}

	@PluginMethod()
	async get(opts: { key: string }) {
		const value = store.get(opts.key)
		return { value }
	}
}

const preferences = new Preferences()

export default preferences

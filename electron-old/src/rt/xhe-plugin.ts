import { ipcRenderer } from 'electron'
import { XhePluginNative } from '../xhe-plugin'

export const XhePlugin: XhePluginNative = {
	start: (t) => ipcRenderer.invoke('xhe-plugin-start', t),
	stop: (t) => ipcRenderer.invoke('xhe-plugin-stop', t),
	get: (opts) => ipcRenderer.invoke('xhe-plugin-get', opts),
	set: (opts) => ipcRenderer.invoke('xhe-plugin-set', opts),
}

export const XhePreferencesPlugin = {
	get: (opts) => ipcRenderer.invoke('xhe-preferences-get', opts),
	set: (opts) => ipcRenderer.invoke('xhe-preferences-set', opts),
}

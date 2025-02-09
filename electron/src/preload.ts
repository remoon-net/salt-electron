// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

const plugins: { [p: string]: { [m: string]: boolean } } =
	ipcRenderer.sendSync('cap-electron-plugins')

const pluginsFns: { [p: string]: { [m: string]: (...args: any[]) => Promise<any> } } = {}
for (const p in plugins) {
	pluginsFns[p] = {}
}
for (const p in plugins) {
	const plugin = pluginsFns[p]
	for (const m in plugins[p]) {
		plugin[m] = (...args: any[]) => ipcRenderer.invoke(`cap-electron-plugin-${p}-${m}`, ...args)
	}
}

contextBridge.exposeInMainWorld('CapacitorCustomPlatform', {
	name: 'electron',
	plugins: pluginsFns,
})

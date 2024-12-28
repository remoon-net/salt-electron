import './wasm_exec'
if (!WebAssembly.instantiateStreaming) {
	WebAssembly.instantiateStreaming = async (resp, importObject) => {
		const source = await (await resp).arrayBuffer()
		return await WebAssembly.instantiate(source, importObject)
	}
}

import { assets } from '$app/paths'
import type { XhePlugin } from './xhe'

export async function load() {
	const go = new Go()
	const wasm = fetch(`${assets}/wasm/libvpn.wasm`)
	const { instance } = await WebAssembly.instantiateStreaming(wasm, go.importObject)
	const proc = go.run(instance)
	// @ts-ignore
	const _exports = go._exports as XhePlugin
	return {
		process: proc,
		..._exports,
	}
}

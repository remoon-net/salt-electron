import './gojs/wasm_exec_node.cjs'

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

import { spawn } from 'child_process'
import { PassThrough } from 'stream'
import { ReadableStream, WritableStream } from 'web-streams-polyfill'
import { readFile } from 'fs/promises'

import { app } from 'electron'
import { join } from 'path'
import isDev from 'electron-is-dev'
import { CapacitorPlugin, PluginMethod } from 'cap-electron'

const fixedPath = isDev ? '' : '../'
const wasm: string = join(app.getAppPath(), fixedPath, './resources/salt-vpn-ipc.wasm')
const bin: string = join(app.getAppPath(), fixedPath, './resources/salt-vpn.bin')
const gsudo: string = join(app.getAppPath(), fixedPath, './resources/gsudo.exe')

export const init = Promise.resolve().then(async () => {
	const stdin = new PassThrough()
	const stdout = new PassThrough()

	const w = new WritableStream({
		write(chunk) {
			return new Promise((rl, rj) => {
				stdout.write(chunk, (err) => (!err ? rl() : rj(err)))
			})
		},
		close() {
			return new Promise((rl) => {
				stdout.end(() => rl())
			})
		},
		abort(err) {
			stdout.destroy(err)
		},
	})

	const go = new Go()
	const buf = await readFile(wasm)
	const { instance } = await WebAssembly.instantiate(buf, go.importObject)
	go.run(instance)

	// @ts-expect-error www
	const fetch = await go._connect(ReadableStream.from(stdin).getReader(), w.getWriter())

	let cmd = []
	switch (process.platform) {
		case 'linux':
			cmd = ['pkexec', bin]
			if (isDev) {
				cmd = [bin]
			}
			break
		case 'win32':
			cmd = [gsudo, bin]
			break
		default:
			throw new Error(`This platform "${process.platform}" is not supported now.`)
	}

	const proc = spawn(cmd[0], cmd.slice(1), {
		stdio: ['pipe', 'pipe', 'inherit'],
		windowsHide: true,
	})
	stdout.pipe(proc.stdin)
	proc.stdout.pipe(stdin)
	if (proc.exitCode) {
		throw new Error(`proc exited. code: ${proc.exitCode}`)
	}
	proc.on('exit', (code) => {
		app.exit(code)
	})

	return fetch as (req: Request) => Promise<Response>
})

@CapacitorPlugin({ name: 'Xhe' })
class XhePlugin implements XhePluginNative {
	constructor(public init: Promise<(req: Request) => Promise<Response>>) {}

	@PluginMethod()
	async start(opts: { target: Target }) {
		const fetch = await this.init

		const u = new URL('http://salt-vpn/start')
		u.searchParams.set('selector', `${opts.target}`)
		const req = new Request(u, { method: 'POST' })
		const resp = await fetch(req)
		if (resp.status != 204) {
			const body = await resp.json()
			console.log(body)
			throw new Error(body.message)
		}
	}

	@PluginMethod()
	async stop(opts: { target: Target }) {
		const fetch = await this.init

		const u = new URL('http://salt-vpn/stop')
		u.searchParams.set('selector', `${opts.target}`)
		const req = new Request(u, { method: 'POST' })
		const resp = await fetch(req)
		if (resp.status != 204) {
			const body = await resp.json()
			console.log(body)
			throw new Error(body.message)
		}
	}

	initialized = false

	@PluginMethod()
	async set(opts: { selector: string; action: string; value: string }) {
		const fetch = await this.init

		const initConfig = opts.selector === 'settings' && opts.action === 'init'
		if (initConfig && this.initialized) {
			// 避免重复初始化导致出错
			return
		}
		const u = new URL('http://salt-vpn/set')
		u.searchParams.set('selector', opts.selector)
		u.searchParams.set('action', opts.action)
		const req = new Request(u, { method: 'PUT', body: opts.value })
		const resp = await fetch(req)
		if (resp.status != 204) {
			const body = await resp.json()
			console.log(body)
			throw new Error(body.message)
		}
		if (initConfig) {
			this.initialized = true
		}
	}

	@PluginMethod()
	async get(opts: { selector: string }) {
		const fetch = await this.init

		const u = new URL('http://salt-vpn/get')
		u.searchParams.set('selector', opts.selector)
		const req = new Request(u, { method: 'GET' })
		const resp = await fetch(req)
		if (resp.status != 200) {
			const body = await resp.json()
			console.log(body)
			throw new Error(body.message)
		}
		const value = await resp.text()
		return { value: value }
	}
}

const xhe = new XhePlugin(init)

export default xhe

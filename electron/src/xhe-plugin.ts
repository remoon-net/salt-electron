require('./gojs/wasm_exec_node')

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

import { app, ipcMain } from 'electron'
import { join } from 'path'
import electronIsDev from 'electron-is-dev'

const fixedPath = electronIsDev ? '' : '../'
const wasm: string = join(app.getAppPath(), fixedPath, './resources/salt-vpn-ipc.wasm')
const bin: string = join(app.getAppPath(), fixedPath, './resources/salt-vpn.bin')

export async function load() {
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

	// @ts-ignore
	const fetch: (req: Request) => Promise<Response> = await go._connect(
		ReadableStream.from(stdin).getReader(),
		w.getWriter(),
	)

	let cmd = []
	switch (process.platform) {
		case 'linux':
			cmd = ['pkexec', bin]
			break
		case 'win32':
			cmd = [bin]
			break
		default:
			throw new Error(`This platform "${process.platform}" is not supported now.`)
	}

	const proc = spawn(cmd[0], cmd.slice(1), { stdio: ['pipe', 'pipe', 'inherit'] })
	stdout.pipe(proc.stdin)
	proc.stdout.pipe(stdin)
	if (proc.exitCode) {
		throw new Error(`proc exited. code: ${proc.exitCode}`)
	}
	proc.on('exit', (code) => {
		app.exit(code)
	})

	const xhe: XhePluginNative = {
		async start(opts) {
			const u = new URL('http://salt-vpn/start')
			u.searchParams.set('selector', `${opts.target}`)
			const req = new Request(u, { method: 'POST' })
			const resp = await fetch(req)
			if (resp.status != 204) {
				const body = await resp.json()
				console.log(body)
				throw new Error(body.message)
			}
		},
		async stop(opts) {
			const u = new URL('http://salt-vpn/stop')
			u.searchParams.set('selector', `${opts.target}`)
			const req = new Request(u, { method: 'POST' })
			const resp = await fetch(req)
			if (resp.status != 204) {
				const body = await resp.json()
				console.log(body)
				throw new Error(body.message)
			}
		},
		async set(opts) {
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
		},
		async get(opts) {
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
		},
	}

	ipcMain.handle('xhe-plugin-start', (e, opts) => xhe.start(opts))
	ipcMain.handle('xhe-plugin-stop', (e, opts) => xhe.stop(opts))
	ipcMain.handle('xhe-plugin-get', (e, opts) => xhe.get(opts))
	ipcMain.handle('xhe-plugin-set', (e, opts) => xhe.set(opts))

	await xhe.get({ selector: 'status' })

	return xhe
}

import Store from 'electron-store'

const store = new Store()

ipcMain.handle('xhe-preferences-set', (e, opts) => {
	// @ts-ignore
	return store.set(opts.key, opts.value)
})
ipcMain.handle('xhe-preferences-get', (e, opts) => {
	// @ts-ignore
	const value = store.get(opts.key, null)
	return { value }
})

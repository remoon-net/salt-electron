#!/usr/bin/env node

// @ts-check

import { $ } from 'zx'

const ver = `v0.0.2`
const resSrv = `https://salt-resources.remoon.net`
const aar = `${resSrv}/libvpn/${ver}/libvpn.aar`
const ipcWasm = `${resSrv}/libvpn/${ver}/salt-vpn-ipc.wasm`
const saltBin = `${resSrv}/libvpn/${ver}/salt-vpn-${process.platform}-${process.arch}.bin`
const gsudo = `${resSrv}/gsudo/v2.5.1/gsudo-${process.arch}.exe`
const wintun = `${resSrv}/wintun/0.14.1/wintun-${process.arch}.dll`

const platform = process.env.CAPACITOR_PLATFORM_NAME
async function copyAfter() {
	switch (platform) {
		case 'android':
			await $`rm -rf android/app/src/main/assets/public/wasm/libvpn.wasm`
			break
		case 'cap-electron':
			await $`rm -rf electron/app/wasm/libvpn.wasm`
			break
	}
}

async function updateAfter() {
	console.log(`下载必要的二进制文件中`)
	switch (platform) {
		case 'android':
			await $`wget -qO android/app/libs/libvpn.aar ${aar}`
			break
		case 'cap-electron':
			await $`rm -rf electron/resources/*`
			await $`touch electron/resources/.gitkeep`
			let tasks = [
				download('electron/resources/salt-vpn-ipc.wasm', ipcWasm),
				download('electron/resources/salt-vpn.bin', saltBin).then(async () => {
					if (process.platform === 'linux') {
						await $`chmod +x electron/resources/salt-vpn.bin`
					}
				}),
			]
			if (process.platform === 'win32') {
				tasks.push(
					download('electron/resources/gsudo.exe', gsudo),
					download('electron/resources/wintun.dll', wintun),
				)
			}
			await Promise.all(tasks)
			break
	}
	console.log('下载完成')
}

void (function main() {
	const hook = process.argv[2] ?? 'copy-after'
	if (hook === 'copy-after') {
		return copyAfter()
	}
	if (hook === 'update-after') {
		return updateAfter()
	}
})()

import fs from 'fs/promises'
/**
 *
 * @param {string} output
 * @param {string} link
 */
async function download(output, link) {
	const dn = output.replace('electron/resources/', '')
	console.log(`${dn} 开始下载`)
	const resp = await fetch(link, { redirect: 'follow' })
	if (resp.status != 200) {
		throw new Error(`${dn} 下载出错. status: ${resp.statusText}, link: ${link}`)
	}
	const blob = await resp.bytes()
	await fs.writeFile(output, blob)
	console.log(`${dn} 下载完成`)
}

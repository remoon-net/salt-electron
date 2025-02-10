import { $ } from 'zx'

void (async function main() {
	const platform = process.env.CAPACITOR_PLATFORM_NAME
	switch (platform) {
		case 'android':
			$`rm -rf android/app/src/main/assets/public/wasm/libvpn.wasm`
			break
		case 'cap-electron':
			$`rm -rf electron/app/wasm/libvpn.wasm`
			break
	}
})()

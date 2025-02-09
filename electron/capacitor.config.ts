import type { ElectronConfig } from '@capacitor-community/electron'
import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig & { electron: ElectronConfig } = {
	appId: 'net.remoon.salt',
	appName: 'Salt VPN',
	webDir: 'build',
	electron: {
		trayIconAndMenuEnabled: true,
	},
}

export default config

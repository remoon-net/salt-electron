import type { ForgeConfig } from '@electron-forge/shared-types'
import { MakerSquirrel } from '@electron-forge/maker-squirrel'
import { MakerZIP } from '@electron-forge/maker-zip'
import { MakerDeb } from '@electron-forge/maker-deb'
import { VitePlugin } from '@electron-forge/plugin-vite'
import { FusesPlugin } from '@electron-forge/plugin-fuses'
import { FuseV1Options, FuseVersion } from '@electron/fuses'
import { PublisherS3 } from '@electron-forge/publisher-s3'

const config: ForgeConfig = {
	packagerConfig: {
		asar: true,
		executableName: 'salt-vpn',
		icon: 'assets/salt-icon',
		ignore: (file: string) => {
			if (!file) return false
			if (file.startsWith('/.vite')) {
				return false
			}
			if (file.startsWith('/app')) {
				return false
			}
			if (file.startsWith('/assets')) {
				return false
			}
			return true
		},
		extraResource: ['resources/'],
	},
	rebuildConfig: {},
	makers: [
		new MakerSquirrel((arch) => ({
			remoteReleases: `https://salt-resources.remoon.net/salt-vpn/win32-${arch}`,
		})),
		new MakerZIP(
			(arch) => ({
				macUpdateManifestBaseUrl: `https://salt-resources.remoon.net/salt-vpn/darwin-${arch}`,
			}),
			['darwin'],
		),
		new MakerDeb({
			options: {
				icon: 'assets/salt-icon.png',
				categories: ['Network'],
				section: 'net',
				depends: ['iproute2', 'policykit-1'],
				homepage: 'https://salt.remoon.net/vpn/',
			},
		}),
	],
	publishers: [
		new PublisherS3({
			bucket: 'salt-resources',
			public: true,
			keyResolver(fileName, platform, arch) {
				return `salt-vpn/${platform}-${arch}/${fileName}`
			},
		}),
	],
	plugins: [
		new VitePlugin({
			// `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
			// If you are familiar with Vite configuration, it will look really familiar.
			build: [
				{
					// `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
					entry: 'src/main.ts',
					config: 'vite.main.config.ts',
					target: 'main',
				},
				{
					entry: 'src/preload.ts',
					config: 'vite.preload.config.ts',
					target: 'preload',
				},
			],
			renderer: [],
		}),
		// Fuses are used to enable/disable various Electron functionality
		// at package time, before code signing the application
		new FusesPlugin({
			version: FuseVersion.V1,
			[FuseV1Options.RunAsNode]: false,
			[FuseV1Options.EnableCookieEncryption]: true,
			[FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
			[FuseV1Options.EnableNodeCliInspectArguments]: false,
			[FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
			[FuseV1Options.OnlyLoadAppFromAsar]: true,
		}),
	],
}

export default config

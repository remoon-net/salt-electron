import { Capacitor, registerPlugin } from '@capacitor/core'
import {
	Preferences as PreferencesRaw,
	type PreferencesPlugin as PreferencesPluginRaw,
} from '@capacitor/preferences'

type PreferencesPlugin = Pick<PreferencesPluginRaw, 'get' | 'set'>

const isElectron = Capacitor.getPlatform() === 'electron'

const PreferencesElectron = registerPlugin<PreferencesPlugin>('xhe-preferences', {
	electron: () => (window as any).CapacitorCustomPlatform.plugins.XhePreferences,
})

export const Preferences = isElectron ? PreferencesElectron : PreferencesRaw

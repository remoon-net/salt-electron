import { registerPlugin } from '@capacitor/core'
import {
	Preferences as PreferencesRaw,
	type PreferencesPlugin as PreferencesPluginRaw,
} from '@capacitor/preferences'

type PreferencesPlugin = Pick<PreferencesPluginRaw, 'get' | 'set'>

export const Preferences = registerPlugin<PreferencesPlugin>('xhe-preferences', {
	web: PreferencesRaw,
	android: PreferencesRaw,
	ios: PreferencesRaw,
	electron: () => (window as any).CapacitorCustomPlatform.plugins.XhePreferences,
})

import {
	Preferences as PreferencesRaw,
	type PreferencesPlugin as PreferencesPluginRaw,
} from '@capacitor/preferences'

export const Preferences: Pick<PreferencesPluginRaw, 'get' | 'set'> = PreferencesRaw

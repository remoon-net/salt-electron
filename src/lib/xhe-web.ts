import { WebPlugin } from '@capacitor/core'

import type { XhePlugin } from './xhe'

export class XheWeb extends WebPlugin implements XhePlugin {
	async echo(options: { value: string }): Promise<{ value: string }> {
		return { value: options.value }
	}
	async start(): Promise<{ value: string }> {
		return { value: 'started' }
	}
	async stop(): Promise<{ value: string }> {
		return { value: 'stopped' }
	}
	async set(typ: string, cfg: string): Promise<string> {
		return ''
	}
	async get(typ: string): Promise<string> {
		return ''
	}
}

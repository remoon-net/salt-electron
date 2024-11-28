import { registerPlugin } from '@capacitor/core'

export interface XhePlugin {
	echo(options: { value: string }): Promise<{ value: string }>
	start(): Promise<{ value: string }>
	stop(): Promise<{ value: string }>
	set(typ: string, cfg: string): Promise<string>
	get(typ: string): Promise<string>
}

const Xhe = registerPlugin<XhePlugin>('Xhe', {
	web: import('./xhe-web').then(({ XheWeb }) => new XheWeb()),
})

export default Xhe

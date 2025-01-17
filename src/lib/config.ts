export interface Config {
	Link: string[]
	Name: string
	Key: string
	Port: number
	Tun: string
	VTun: boolean
	Route: string[]
	NAT: string[]
	ICE: string[]
	Peer: Peer[]
}

export interface Peer {
	Name: string
	Pubkey: string
	PSK: string
	Allow: string[]
	Auto: number
	WHIP: string[]
	ICE: string[]
}

export interface Status extends Config {
	Running: boolean
	Pubkey: string
	Linker: LinkerStatus[]
	ICETags: string[]
	Peer: PeerStatus[]
}

export interface LinkerStatus {
	Link: string
	Endpoint: string
	Running: boolean
	Error: string
}

export interface PeerStatus extends Peer {
	Endpoint?: string
	LastHandshakeTime?: string
	ReceiveBytes?: number
	TransmitBytes?: number
}

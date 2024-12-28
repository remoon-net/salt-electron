import type { Status } from './config'

export const status: Status = {
	Running: false,
	Pubkey: 'f928d4f6c1b86c12f2562c10b07c555c5c57fd00f59e90c8d8d88767271cbf7c',
	Linker: [
		{
			Endpoint: 'http://444:4444',
			Running: false,
			Error: '',
			Link: 'http://127.0.0.1:333',
		},
	],
	Link: ['http://:7799'],
	Key: '087ec6e14bbed210e7215cdc73468dfa23f080a1bfb8665b2fd809bd99d28379',
	Port: 7799,
	Tun: 'xhe-vpn',
	NAT: ['100.64.0.1/10', 'fdd9:f800::1/24'],
	ICE: ['stun://wwwww'],
	ICETags: ['direct', 'relay', 'custom'],
	VTun: false,
	Route: [],
	Peer: [
		{
			Name: 'shynome',
			ICE: ['relay', 'direct'],
			Pubkey: 'c4c8e984c5322c8184c72265b92b250fdb63688705f504ba003c88f03393cf28',
			PSK: 'ba3ef732682972723e233daf6daaa748a6641e4c22b0bc726d94ca03b35055bb',
			Allow: ['100.64.0.2/32', 'fdd9:f800::2/24'],
			WHIP: ['http://192.168.1.186:2233'],
			Auto: '15',
		},
		{
			Name: 'shynome2',
			ICE: ['relay'],
			Pubkey: 'c4c8e984c5322c8184c72265b92b250fdb63688705f504ba003c88f03393cf29',
			PSK: 'ba3ef732682972723e233daf6daaa748a6641e4c22b0bc726d94ca03b35055bb',
			Allow: ['100.64.0.3/32', 'fdd9:f800::3/24'],
			WHIP: ['http://192.168.1.186:2233'],
			Auto: '15',
		},
	],
}

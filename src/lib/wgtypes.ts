type Key = string

type int = number

export const enum DeviceType {}

export interface Device {
	// Name is the name of the device.
	Name: string

	// Type specifies the underlying implementation of the device.
	Type: DeviceType

	// PrivateKey is the device's private key.
	PrivateKey: Key

	// PublicKey is the device's public key, computed from its PrivateKey.
	PublicKey: Key

	// ListenPort is the device's network listening port.
	ListenPort: int

	// FirewallMark is the device's current firewall mark.
	//
	// The firewall mark can be used in conjunction with firewall software to
	// take action on outgoing WireGuard packets.
	FirewallMark: int

	// Peers is the list of network peers associated with this device.
	Peers: Peer[]
}

export interface Peer {
	// PublicKey is the public key of a peer, computed from its private key.
	//
	// PublicKey is always present in a Peer.
	PublicKey: Key

	// PresharedKey is an optional preshared key which may be used as an
	// additional layer of security for peer communications.
	//
	// A zero-value Key means no preshared key is configured.
	PresharedKey: Key

	// Endpoint is the most recent source address used for communication by
	// this Peer.
	Endpoint: string

	// PersistentKeepaliveInterval specifies how often an "empty" packet is sent
	// to a peer to keep a connection alive.
	//
	// A value of 0 indicates that persistent keepalives are disabled.
	PersistentKeepaliveInterval: string

	// LastHandshakeTime indicates the most recent time a handshake was performed
	// with this peer.
	//
	// A zero-value time.Time indicates that no handshake has taken place with
	// this peer.
	LastHandshakeTime: string

	// ReceiveBytes indicates the number of bytes received from this peer.
	ReceiveBytes: int64

	// TransmitBytes indicates the number of bytes transmitted to this peer.
	TransmitBytes: int64

	// AllowedIPs specifies which IPv4 and IPv6 addresses this peer is allowed
	// to communicate on.
	//
	// 0.0.0.0/0 indicates that all IPv4 addresses are allowed, and ::/0
	// indicates that all IPv6 addresses are allowed.
	AllowedIPs: string[]

	// ProtocolVersion specifies which version of the WireGuard protocol is used
	// for this Peer.
	//
	// A value of 0 indicates that the most recent protocol version will be used.
	ProtocolVersion: int
}
type int64 = number

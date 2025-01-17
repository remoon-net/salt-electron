<script>
	import Key from './key.svelte'
	import Pubkey from './pubkey.svelte'
	import Nickname from './nickname.svelte'
	import Tun from './tun.svelte'
	import VTun from './vtun.svelte'
	import Socks5 from './socks5.svelte'
	import Listen from './listen.svelte'
	import NAT from './nat.svelte'
	import Allow from './allow.svelte'
	import ICETag from './ice-tag.svelte'
	import ICEServer from './ice-server.svelte'
	import ICEPolicy from './ice-policy.svelte'
	import Linker from './linker.svelte'
	import WHIP from './whip.svelte'
	import PeerPubkey from './peer-pubkey.svelte'
	import PSK from './psk.svelte'
</script>

<Linker></Linker>
<WHIP></WHIP>
<hr />
<Key></Key>
<Pubkey></Pubkey>
<hr />
<PeerPubkey></PeerPubkey>
<PSK></PSK>
<hr />
<Nickname></Nickname>
<hr />
<Tun></Tun>
<VTun></VTun>
<Socks5></Socks5>
<hr />
<Listen></Listen>
<hr />
<NAT></NAT>
<Allow></Allow>
<hr />
<ICEServer></ICEServer>
<ICETag></ICETag>
<ICEPolicy></ICEPolicy>

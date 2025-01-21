<script lang="ts">
	import { type Peer, type PeerStatus } from '$lib/config'
	import { Address, Address4, Address6 } from '$lib/netip'
	import { getSnackbarShow, tooltip } from '@remoon.net/bootstrap'
	import { page } from '$app/state'
	import { copy } from 'svelte-copy'

	const { peer }: { peer: PeerStatus } = $props()
	function peerEditLink(pubkey: string) {
		const u = new URL(`/peer/edit/`, page.url.href)
		u.searchParams.set('pubkey', pubkey)
		return u.toString()
	}
	const showSnackbar = getSnackbarShow()
</script>

<h4>
	<a class="pubkey" href={peerEditLink(peer.Pubkey)}>
		{!!peer.Name ? peer.Name : peer.Pubkey}
	</a>
</h4>
{#each peer.Allow as allow}
	{@const addr = Address(allow)}
	{@const addrText = addr?.addressMinusSuffix ?? 'no address'}
	<div class="ip">
		<span class="badge text-bg-primary">
			{#if addr instanceof Address4}
				IPv4
			{:else if addr instanceof Address6}
				IPv6
			{:else}
				unkown
			{/if}
		</span>
		<button
			class="btn btn-sm fs-6"
			use:tooltip={{ title: '点击复制' }}
			use:copy={{
				text: addrText,
				onCopy: () => showSnackbar({ msg: `IP地址复制成功.\n${addrText}` }),
			}}
		>
			{addrText}
		</button>
	</div>
{/each}
<div class="row row-cols-auto g-1">
	{#each peer.ICE as ice}
		<div class="col">
			<span class="badge text-bg-secondary">
				{ice}
			</span>
		</div>
	{/each}
</div>

<style>
	.ip > * {
		vertical-align: middle;
	}
	.pubkey {
		word-break: break-all;
		display: block;
	}
</style>

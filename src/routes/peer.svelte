<script lang="ts">
	import { hex2base64, type Peer, type PeerStatus } from '$lib/config'
	import { Address, Address4, Address6 } from '$lib/netip'
	import { tooltip } from '@remoon.net/bootstrap'

	const { peer }: { peer: PeerStatus } = $props()
</script>

<h4>
	<a class="pubkey" href="/peer/edit/?pubkey={peer.Pubkey}">
		{!!peer.Name ? peer.Name : hex2base64(peer.Pubkey)}
	</a>
</h4>
{#each peer.Allow as allow}
	{@const addr = Address(allow)}
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
		<button class="btn btn-sm fs-6" use:tooltip={{ title: '点击复制' }}>
			{addr?.addressMinusSuffix ?? 'no address'}
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

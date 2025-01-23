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
	import pp from 'pretty-bytes'
	import { DateTime } from 'luxon'
</script>

<h4 class="mb-0">
	<a class="pubkey" href={peerEditLink(peer.Pubkey)}>
		{!!peer.Name ? peer.Name : peer.Pubkey}
	</a>
</h4>
{#if !!peer.Endpoint}
	<div class="row g-0">
		<div class="col">
			{#if peer.Endpoint === '127.0.0.1:1'}
				<small>未连接</small>
			{:else if peer.Endpoint === '127.0.0.1:2'}
				<small>连接中</small>
			{:else if peer.Endpoint === '127.0.0.1:3'}
				<small>连接中</small>
			{:else}
				{@const beforeNow = DateTime.fromISO(peer.LastHandshakeTime!).toRelative({
					style: 'short',
					unit: 'seconds',
				})}
				<small>{peer.Endpoint}</small>
				<small class="last-handshake-time" title="上次握手时间" use:tooltip>({beforeNow})</small>
			{/if}
		</div>
		<div class="col col-auto">
			<small>
				<i class="bi bi-arrow-up"></i>
				{pp(peer.TransmitBytes!)}
			</small>
			<small>
				<i class="bi bi-arrow-down"></i>
				{pp(peer.ReceiveBytes!)}
			</small>
		</div>
	</div>
{/if}
<div class="mt-1"></div>
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
	{#if !!peer.Auto}
		<div class="col">
			<span class="badge text-bg-primary">
				Auto
			</span>
		</div>
	{/if}
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
	.last-handshake-time {
		white-space: nowrap;
	}
</style>

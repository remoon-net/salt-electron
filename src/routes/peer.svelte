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
	import { PCStatus } from '$lib/xhe'
	let pcs = $derived.by<PCStatus>(() => {
		try {
			// @ts-ignore
			return new URL('http://' + peer.Endpoint).port - 1
		} catch {
			alert(`解析Endpoint出错: ${peer.Endpoint}`)
			return 0
		}
	})
	let u = $derived.by(() => {
		try {
			return new URL('http://' + peer.Endpoint)
		} catch {
			alert(`解析Endpoint出错: ${peer.Endpoint}`)
			return new URL('http://remoon.net')
		}
	})
</script>

<h4 class="mb-0">
	<a class="pubkey" href={peerEditLink(peer.Pubkey)}>
		{!!peer.Name ? peer.Name : peer.Pubkey}
	</a>
</h4>
{#if !!peer.Endpoint}
	<div class="row g-0">
		<div class="col status">
			{#if u.hostname == '127.0.0.1'}
				{#if pcs == 0}
					<small>未连接</small>
				{/if}
				{#if pcs !== 0}
					{#if (pcs & PCStatus.SignlerConnecting) != 0}
						<small>信令连接中</small>
					{:else if (pcs & PCStatus.SignlerConnected) != 0}
						<small>信令已连接</small>
					{:else if (pcs & PCStatus.SignlerOpened) != 0}
						<small>信令通信中</small>
					{:else if (pcs & PCStatus.SignlerClosed) != 0}
						<small>信令已关闭</small>
					{:else}
						<small>信令状态 {pcs}</small>
					{/if}
				{/if}
				<!-- 优先展示数据通道的状态 -->
				{#if pcs >> 8 != 0}
					{#if (pcs & PCStatus.DCConnecting) != 0}
						<small>通道打开中</small>
					{:else if (pcs & PCStatus.DCConnected) != 0}
						<small>通道已打开</small>
					{:else if (pcs & PCStatus.DCClosed) != 0}
						<small>通道已关闭</small>
					{:else}
						<small>通道状态 {pcs}</small>
					{/if}
				{:else if pcs >> 4 != 0}
					{#if (pcs & PCStatus.PeerConnecting) != 0}
						<small>p2p连接中</small>
					{:else if (pcs & PCStatus.PeerConnected) != 0}
						<small>p2p已连接</small>
					{:else if (pcs & PCStatus.PeerClosed) != 0}
						<small>p2p已关闭</small>
					{:else}
						<small>p2p状态 {pcs}</small>
					{/if}
				{/if}
			{:else}
				<small>{peer.Endpoint}</small>
			{/if}
			{#if !!peer.LastHandshakeTime}
				{@const beforeNow = DateTime.fromISO(peer.LastHandshakeTime).toRelative({
					style: 'short',
					unit: 'seconds',
				})}
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
			<span class="badge text-bg-primary"> Auto </span>
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
	.status small {
		white-space: nowrap;
	}
</style>

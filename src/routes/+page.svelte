<script lang="ts">
	const { data } = $props()
	import Peer from './peer.svelte'
	import Panel from './panel.svelte'
	import Op from './op.svelte'
	import { invalidate } from '$app/navigation'
	import LinkerImport from './linker-import.svelte'

	$effect(() => {
		// 当页面切换回来后同步一次最新数据
		function syncStatus() {
			if (document.visibilityState === 'visible') {
				invalidate('app:status')
			}
		}
		document.addEventListener('visibilitychange', syncStatus)
		return () => {
			document.removeEventListener('visibilitychange', syncStatus)
		}
	})
</script>

<LinkerImport></LinkerImport>
<div class="container">
	<Panel status={data.status}></Panel>
	<hr />
	<Op pubkey={data.status.Pubkey}></Op>
	{#if !data.status.Peer.length}
		<div class="text-center my-5 fs-5 text-secondary">
			<p>空空如也</p>
			<p>
				使用上方的按钮<br />
				添加一些节点吧
			</p>
		</div>
	{/if}
	<div class="mt-3">
		{#each data.status.Peer as p}
			<div class="item border my-2 px-3 py-2 rounded">
				<Peer peer={p}></Peer>
			</div>
		{/each}
	</div>
</div>

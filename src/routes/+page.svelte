<script lang="ts">
	const { data } = $props()
	let status = $derived(data.status)
	import Peer from './peer.svelte'
	import Panel from './panel.svelte'
	import Op from './op.svelte'
</script>

<div class="container">
	<Panel status={data.status}></Panel>
	<hr />
	<Op pubkey={status.Pubkey}></Op>
	<div class="mt-3">
		{#each status.Peer as p}
			<div class="item border my-2 px-3 py-2 rounded">
				<Peer peer={p}></Peer>
			</div>
		{/each}
	</div>
</div>

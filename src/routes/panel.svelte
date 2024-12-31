<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { hex2base64, type LinkerStatus, type Status } from '$lib/config'

	const { status }: { status: Status } = $props()
	import xhe, { Target } from '$lib/xhe'

	async function start() {
		await xhe.start(Target.All)
		await invalidate('app:status')
	}
	async function stop() {
		await xhe.stop(Target.All)
		await invalidate('app:status')
	}

	import { DisplayStatus } from './panel.util'

	function getLinkerDisplayStatus(s: LinkerStatus) {
		if (!s.Running && !s.Error) {
			return DisplayStatus.Ready
		}
		if (s.Running) {
			return DisplayStatus.Running
		}
		if (!!s.Error) {
			return DisplayStatus.Error
		}
		return DisplayStatus.Unkown
	}
</script>

<div class="row align-items-center my-3">
	<div class="col">
		<div class="pubkey">
			<a href="/panel/controller/">
				{status.Tun}
			</a>
		</div>
		<div class="linkers">
			{#each status.Linker as lk}
				{@const ds = getLinkerDisplayStatus(lk)}
				<i
					class="linker"
					class:text-bg-secondary={ds === DisplayStatus.Ready}
					class:text-bg-success={ds === DisplayStatus.Running}
					class:text-bg-danger={ds === DisplayStatus.Error}
				></i>
			{/each}
		</div>
	</div>
	<div class="col col-auto text-end">
		{#if status.Running}
			<button class="btn btn-outline-primary" aria-label="start" type="button" onclick={stop}>
				<i class="bi bi-pause"></i>
			</button>
		{:else}
			<button class="btn btn-outline-primary" aria-label="start" type="button" onclick={start}>
				<i class="bi bi-play"></i>
			</button>
		{/if}
	</div>
</div>

<style>
	.pubkey {
		word-break: break-all;
	}
	.linkers {
		line-height: 0.4rem;
	}
	.linker {
		display: inline-block;
		border-radius: 100%;
		width: 0.4rem;
		height: 0.4rem;
	}
</style>

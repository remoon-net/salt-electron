<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { errStr, type LinkerStatus, type Status } from '$lib/config'
	import { withPending } from '$lib/pending.svelte'

	const { status }: { status: Status } = $props()
	import xhe, { sleep, Target } from '$lib/xhe'
	import { getSnackbarShow } from '@remoon.net/bootstrap'

	async function start() {
		await xhe.start(Target.All)
	}
	async function stop() {
		await xhe.stop(Target.All)
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

	const pending = withPending()
	const showSnackbar = getSnackbarShow()
</script>

<div class="row align-items-center my-3">
	<div class="col">
		<div class="pubkey">
			<a href="/panel/controller/">
				{status.Tun}
			</a>
			{#if status.VTun}
				<small class="vtun">(V-Tun)</small>
			{/if}
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
		{#if pending.value}
			<button
				class="btn btn-outline-primary"
				aria-label="pending"
				type="button"
				disabled={pending.value}
			>
				<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
				<span class="visually-hidden" role="status">Loading...</span>
			</button>
		{:else if status.Running}
			<button
				class="btn btn-outline-primary"
				aria-label="start"
				type="button"
				onclick={() => {
					pending.call(stop, 500).finally(async () => {
						await invalidate('app:status')
					})
				}}
				disabled={pending.value}
			>
				<i class="bi bi-pause"></i>
			</button>
		{:else}
			<button
				class="btn btn-outline-primary"
				aria-label="stop"
				type="button"
				onclick={() => {
					pending
						.call(start, 500)
						.finally(async () => {
							await invalidate('app:status')
						})
						.catch((err) => {
							showSnackbar({
								msg: `启动中出现了一些错误: ${errStr(err)}`,
								role: 'danger',
							})
						})
				}}
				disabled={pending.value}
			>
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
		margin-left: 0.1rem;
	}
	.linker:first-child {
		margin-left: 0;
	}
</style>

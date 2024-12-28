<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { hex2base64, type Status } from '$lib/config'

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
</script>

<div class="row align-items-center my-3">
	<div class="col">
		<div class="pubkey">
			<a href="/panel/">
				{status.Tun}
			</a>
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
</style>

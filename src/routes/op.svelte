<script lang="ts">
	import { hex2base64 } from '$lib/config'
	import { tooltip } from '@remoon.net/bootstrap'
	import { copy } from 'svelte-copy'

	const { pubkey }: { pubkey: string } = $props()
</script>

<div class="row g-2 align-items-center">
	<div class="col col-auto">
		<button
			class="btn btn-outline-primary btn-sm me-2"
			aria-label="copy self pubkey"
			use:tooltip
			title="点击复制公钥"
			use:copy={hex2base64(pubkey)}
		>
			<i class="bi bi-copy"></i>
			复制
		</button>
	</div>
	<div class="col pubkey">
		<a href="/settings/">
			{hex2base64(pubkey)}
		</a>
	</div>
	<div class="col col-auto">
		<a
			href="/peer/add/"
			class="btn btn-outline-primary btn-sm"
			aria-label="add peer"
			use:tooltip
			title="添加好友"
			data-sveltekit-preload-data={false}
		>
			<i class="bi bi-plus-lg"></i>
		</a>
	</div>
	<div>
		<a href="/peer/import/" class="btn btn-outline-primary w-100">导入好友链接</a>
	</div>
</div>

<style>
	.pubkey {
		word-break: break-all;
		* {
			vertical-align: middle;
		}
	}
</style>

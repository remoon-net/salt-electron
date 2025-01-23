<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	import { tooltip, getSnackbarShow } from '@remoon.net/bootstrap'
	import { copy } from 'svelte-copy'

	const { pubkey }: { pubkey: string } = $props()
	const showSnackbar = getSnackbarShow()

	const pending = withPending()
</script>

<div class="row g-2 align-items-center">
	<div class="col col-auto">
		<button
			class="btn btn-outline-primary btn-sm me-2"
			aria-label="copy self pubkey"
			use:tooltip
			title="点击复制公钥"
			use:copy={{
				text: pubkey,
				onCopy: () => showSnackbar({ msg: '成功复制公钥' }),
				onError: () => showSnackbar({ msg: '复制公钥失败' }),
			}}
		>
			<i class="bi bi-copy"></i>
			复制
		</button>
	</div>
	<div class="col pubkey">
		<a href="/settings/">
			{pubkey}
		</a>
	</div>
	<div class="col col-auto">
		<a
			href="/peer/add/"
			class="btn btn-outline-primary btn-sm"
			aria-label="add peer"
			use:tooltip
			title="添加节点"
			data-sveltekit-preload-data={false}
		>
			<i class="bi bi-plus-lg"></i>
		</a>
	</div>
	<div class="input-group">
		<a href="#linker-import" data-bs-toggle="modal" class="btn btn-outline-primary w-100">
			导入节点链接
		</a>
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

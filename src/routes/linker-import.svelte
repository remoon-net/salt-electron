<script lang="ts">
	import { dev } from '$app/environment'
	import { withPending } from '$lib/pending.svelte'
	import { getSnackbarShow, modal } from '@remoon.net/bootstrap'
	import xhe from '$lib/xhe'
	import { goto } from '$app/navigation'
	import { Modal } from 'bootstrap'
	import { errStr } from '$lib/config'

	const pending = withPending()
	let devClass = ''
	if (dev) {
		// devClass = 'd-block show'
	}

	let link = $state('')
	async function handleSubmit(form: FormData) {
		await xhe.set('peer.share', 'decode', link)
		let s = await xhe.get('peer.share.decoded')
		// console.log(s)
		await new Promise<void>((rl) => {
			let modal = document.getElementById('linker-import')!
			modal.addEventListener('hidden.bs.modal', () => rl(), { once: true })
			Modal.getOrCreateInstance(modal).hide()
		})
		await goto('/peer/add/?peer=share')
	}
	const showSnackbar = getSnackbarShow()
</script>

<form
	onsubmit={(e) => {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		pending
			.call(() => handleSubmit(form), 500)
			.catch((err) => {
				showSnackbar({
					msg: `解析节点链接出错: ${errStr(err)}`,
					role: 'danger',
				})
			})
	}}
>
	<div
		class="modal fade {devClass}"
		id="linker-import"
		tabindex="-1"
		use:modal
		data-bs-backdrop="static"
		onshow.bs.modal={() => {
			link = ''
		}}
	>
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">导入节点链接</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						disabled={pending.value}
					></button>
				</div>
				<div class="modal-body">
					<div class="">
						<label for="peer" class="form-label">节点链接</label>
						<textarea
							name="link"
							class="form-control"
							id="peer"
							rows="12"
							required
							placeholder="peer://[pubkey]/[encode_config]............"
							disabled={pending.value}
							bind:value={link}
						></textarea>
						<div class="form-text">节点链接使用了公钥加密</div>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal"
						disabled={pending.value}
					>
						关闭
					</button>
					<button type="submit" class="btn btn-primary" disabled={pending.value}>
						{#if pending.value}
							<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
							<span class="visually-hidden" role="status">Loading...</span>
							导入中
						{:else}
							导入节点链接
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
</form>

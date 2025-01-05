<script lang="ts">
	import { dev } from '$app/environment'
	import { withPending } from '$lib/pending.svelte'
	import { modal } from '@remoon.net/bootstrap'
	import xhe from '$lib/xhe'
	import { goto } from '$app/navigation'

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
		await goto('/peer/add/?peer=share')
	}
</script>

<form
	onsubmit={(e) => {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		pending.call(() => {
			return handleSubmit(form)
		})
	}}
>
	<div
		class="modal fade {devClass}"
		id="linker-import"
		tabindex="-1"
		use:modal
		data-bs-backdrop="static"
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
					<div class="my-3">
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
						导入节点链接
					</button>
				</div>
			</div>
		</div>
	</div>
</form>

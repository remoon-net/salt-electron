<script lang="ts">
	import { goto } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	import xhe from '$lib/xhe'

	const pending = withPending()
	let link = $state('')
	async function handleSubmit() {
		await xhe.set('peer.share', 'decode', link)
		let s = await xhe.get('peer.share.decoded')
		// console.log(s)
		await goto('/peer/add/?peer=share')
	}
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			pending.call(() => {
				return handleSubmit()
			})
		}}
	>
		<div class="my-3">
			<label for="peer" class="form-label">解析节点链接</label>
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
		<div>
			<button type="submit" id="submit" class="btn btn-primary w-100" disabled={pending.value}>
				解析
			</button>
		</div>
	</form>
</div>

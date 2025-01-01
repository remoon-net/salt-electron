<script lang="ts">
	import { dev } from '$app/environment'
	import type { Peer, Status } from '$lib/config'
	import { withPending } from '$lib/pending.svelte'
	import xhe from '$lib/xhe'

	const { status, peer }: { status: Status; peer: Peer } = $props()

	let allWHIPs = $derived(status.Linker.map((s) => s.Endpoint).filter((s) => !!s))
	let whips = $state(status.Linker.map((s) => s.Endpoint).filter((s) => !!s))

	let pending = withPending()
	let devClass = ''
	if (dev) {
		devClass = 'd-block show'
	}

	import { Select, modal } from '@remoon.net/bootstrap'
	import { Modal } from 'bootstrap'
	import { copyText } from 'svelte-copy'

	let share_link = $state('')

	async function handleSubmit(form: FormData) {
		let p: Peer = {
			Pubkey: peer.Pubkey,
			PSK: peer.PSK,
			Name: form.get('Name') as string,
			WHIP: whips,
			Allow: [],
			Auto: 0,
			ICE: [],
		}
		await xhe.set('peer', 'share', JSON.stringify(p))
		share_link = await xhe.get('peer.share')
		Modal.getOrCreateInstance('#linker-gen').hide()
		Modal.getOrCreateInstance('#linker-show').toggle()
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
	<div class="modal fade" id="linker-gen" tabindex="-1" use:modal data-bs-backdrop="static">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">生成节点链接</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						disabled={pending.value}
					></button>
				</div>
				<div class="modal-body py-2">
					<div class="my-3">
						<label for="linker-name" class="form-label">此节点昵称</label>
						<input
							type="text"
							name="Name"
							id="linker-name"
							class="form-control"
							placeholder="昵称"
							value={status.Name}
							disabled={pending.value}
						/>
						<div class="form-text">在对方那边显示</div>
					</div>
					<div class="my-3">
						<div class="form-label">WHIP</div>
						<Select options={allWHIPs} bind:values={whips} expand disabled={pending.value}></Select>
						<div class="form-text">对方节点通过这些信令服务器连接你</div>
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
					{#if whips.length === 0}
						<button type="submit" class="btn btn-primary" disabled={pending.value}>
							未选择信令服务器, 无法生成节点链接
						</button>
					{:else}
						<button type="submit" class="btn btn-primary" disabled={pending.value}>
							生成节点链接
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</form>

<div class="modal fade" id="linker-show" tabindex="-1">
	<div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">复制节点链接</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body">
				<label for="linker-link" class="form-label">节点链接</label>
				<textarea
					class="form-control"
					name="linker"
					id="linker-link"
					bind:value={share_link}
					readonly
					rows="12"
				></textarea>
				<div class="form-text">内容已加密, 只有好友那边可解密</div>
			</div>
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-primary w-100"
					onclick={(e) => {
						copyText(share_link)
					}}
				>
					点击复制节点链接
				</button>
			</div>
		</div>
	</div>
</div>

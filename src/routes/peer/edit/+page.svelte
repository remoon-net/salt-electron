<script lang="ts">
	import { hex2base64, type Peer } from '$lib/config.js'
	import { withPending } from '$lib/pending.svelte.js'
	import xhe from '$lib/xhe.js'
	import { SvelteSet } from 'svelte/reactivity'

	const { data } = $props()
	const peer = data.peer
	const status = data.status
	const pending = withPending()

	let allows = $state(peer.Allow)
	let whips = $state(peer.WHIP)
	let ices = $state(peer.ICE)
	import { Select, tooltip } from '@remoon.net/bootstrap'
	import { goto, invalidate } from '$app/navigation'

	async function update(form: FormData) {
		let peer: Peer = {
			Name: form.get('Name') as string,
			Pubkey: form.get('Pubkey') as string,
			PSK: form.get('PSK') as string,
			Allow: allows.filter((s) => !!s.trim()),
			Auto: (form.get('Auto') as string) == 'on' ? 15 : 0,
			ICE: ices.filter((s) => !!s.trim()),
			WHIP: whips.filter((s) => !!s.trim()),
		}
		await xhe.set('peer', 'add', JSON.stringify(peer))
		await goto('/')
	}

	async function remove() {
		let d = JSON.stringify({
			Pubkey: peer.Pubkey,
		})
		await xhe.set('peer', 'remove', d)
		await goto('/')
	}

	let psk = $state(peer.PSK)
	async function genpsk() {
		psk = await xhe.get('genpsk')
	}
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			let form = new FormData(e.currentTarget)
			pending.call(() => {
				return update(form)
			})
		}}
	>
		<div class="my-3">
			<label for="name" class="form-label">好友昵称 *</label>
			<input
				type="text"
				name="Name"
				id="name"
				class="form-control"
				placeholder="昵称"
				value={peer.Name}
				disabled={pending.value}
				required
			/>
			<div class="form-text">便于识别</div>
		</div>
		<div class="my-3">
			<label for="pubkey" class="form-label">公钥 *</label>
			<div class="input-group">
				<input
					type="text"
					name="Pubkey"
					id="pubkey"
					class="form-control"
					placeholder="公钥"
					value={hex2base64(peer.Pubkey)}
					disabled={pending.value}
				/>
				<button
					type="button"
					class="btn btn-outline-danger"
					aria-label="delete route"
					onclick={() => {
						pending.call(() => {
							let confirmed = confirm('确认是否移除该好友?')
							if (!confirmed) {
								return
							}
							remove()
						})
					}}
					disabled={pending.value}
				>
					<i class="bi bi-trash3"></i>
				</button>
			</div>
			<div class="form-text">好友的身份码</div>
		</div>

		<div class="my-3">
			<label for="psk" class="form-label">共享密钥</label>
			<div class="input-group">
				<input
					type="text"
					name="PSK"
					id="psk"
					class="form-control"
					placeholder="共享密钥"
					value={hex2base64(psk)}
					disabled={pending.value}
				/>
				<button
					class="btn btn-outline-secondary"
					type="button"
					aria-label="生成共享密钥"
					title="点击随机生成共享密钥"
					use:tooltip
					onclick={genpsk}
				>
					<i class="bi bi-arrow-clockwise"></i>
				</button>
			</div>
			<div class="form-text">加强安全性以应对后量子时代, 和好友保持一致方可连接</div>
		</div>
		<div class="my-3">
			<label for="ice" class="form-label">连接策略</label>
			<Select options={status.ICETags} bind:values={ices}></Select>
			<div class="form-text">含有直连策略时将会暴露IP给好友</div>
		</div>
		<div class="my-3">
			<div class="row align-items-center mb-2">
				<div class="col">
					<label for="whip-last" class="form-label mb-0">WHIP</label>
				</div>
				<div class="col col-auto">
					<div class="input-group">
						<div class="input-group-text">
							<input
								type="checkbox"
								class="form-check-input mt-0 me-1"
								name="Auto"
								id="auto_start"
								autocomplete="off"
								checked={peer.Auto > 0}
								disabled={whips.length == 0 || pending.value}
							/>
							<label class="from-check-label" for="auto_start">自动连接</label>
						</div>
						<button
							type="button"
							class="btn btn-sm btn-outline-primary"
							aria-label="add new route field"
							onclick={() => {
								whips.push('')
							}}
							disabled={pending.value}
						>
							<i class="bi bi-plus-lg"></i>
						</button>
					</div>
				</div>
			</div>
			{#each whips as whip, i}
				<div class="input-group mb-2">
					<input
						type="url"
						name="WHIP"
						id={i === allows.length - 1 ? 'whip-last' : ''}
						class="form-control"
						placeholder="WHIP"
						bind:value={whips[i]}
						disabled={pending.value}
					/>
					<button
						type="button"
						class="btn btn-outline-danger"
						aria-label="delete route"
						onclick={() => {
							whips.splice(i, 1)
						}}
						disabled={pending.value}
					>
						<i class="bi bi-trash3"></i>
					</button>
				</div>
			{/each}
			<div class="form-text">WHIP用于和好友建立连接</div>
		</div>
		<div class="my-3">
			<div class="row align-items-center mb-2">
				<div class="col">
					<label for="allow-last" class="form-label mb-0">路由</label>
				</div>
				<div class="col col-auto">
					<button
						type="button"
						class="btn btn-sm btn-outline-primary"
						aria-label="add new route field"
						onclick={() => {
							allows.push('')
						}}
						disabled={pending.value}
					>
						<i class="bi bi-plus-lg"></i>
					</button>
				</div>
			</div>
			{#each allows as a, i}
				<div class="input-group mb-2">
					<input
						type="text"
						name="Allow"
						id={i === allows.length - 1 ? 'allow-last' : ''}
						class="form-control"
						placeholder="路由"
						value={a}
						disabled={pending.value}
						required
					/>
					<button
						type="button"
						class="btn btn-outline-danger"
						aria-label="delete route"
						onclick={() => {
							allows.splice(i, 1)
						}}
						disabled={pending.value}
					>
						<i class="bi bi-trash3"></i>
					</button>
				</div>
			{/each}
			<div class="form-text">分配访问地址, 一般会自动生成不用修改</div>
		</div>
		<button type="submit" id="submit" class="btn btn-primary w-100" disabled={pending.value}>
			保存
		</button>
	</form>
</div>

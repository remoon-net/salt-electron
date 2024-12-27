<script lang="ts">
	import { withPending } from '$lib/pending.svelte'
	import { collapse, Select, tooltip } from '@remoon.net/bootstrap'
	import xhe from '$lib/xhe.js'
	import { base64Tohex, hex2base64, type Peer } from '$lib/config'
	import { goto, invalidate } from '$app/navigation'

	const { data } = $props()
	const status = data.status

	const pending = withPending(false)
	let showMore = $state(false)
	let ices = $state(['direct', 'relay'])
	let whips = $state(status.Linker.map((v) => v.Endpoint))
	let psk = $state('')
	async function genpsk() {
		psk = await xhe.get('genpsk')
	}
	async function add(form: FormData) {
		let peer: Peer = {
			Name: form.get('Name') as string,
			Pubkey: base64Tohex(form.get('Pubkey') as string),
			PSK: psk,
			ICE: ices,
			Auto: 0,
			WHIP: [],
			Allow: [],
		}
		await xhe.set('peer', 'add', JSON.stringify(peer))
		await invalidate('app:status')
		await goto('/')
	}
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			let form = new FormData(e.currentTarget)
			pending.call(() => {
				add(form)
			})
		}}
	>
		<div class="my-3">
			<label for="name" class="form-label">好友昵称</label>
			<input
				type="text"
				name="Name"
				id="name"
				class="form-control"
				placeholder="昵称"
				disabled={pending.value}
			/>
			<div class="form-text">便于分辨好友</div>
		</div>
		<div class="my-3">
			<label for="pubkey" class="form-label">公钥 *</label>
			<input
				type="text"
				name="Pubkey"
				id="pubkey"
				class="form-control"
				placeholder="公钥"
				required
				disabled={pending.value}
			/>
			<div class="form-text">好友公钥</div>
		</div>
		<div class="text-center">
			<button
				type="button"
				class="btn btn-sm more"
				data-bs-toggle="collapse"
				data-bs-target="#more"
			>
				{#if showMore}
					<i class="bi bi-chevron-compact-up"></i>
					<br />收起高级选项
				{:else}
					展开高级选项<br />
					<i class="bi bi-chevron-compact-down"></i>
				{/if}
			</button>
		</div>
		<div
			id="more"
			class="collapse"
			use:collapse={{ toggle: false }}
			onshow.bs.collapse={() => {
				showMore = true
			}}
			onhide.bs.collapse={() => {
				showMore = false
			}}
		>
			<div class="my-3">
				<label for="psk" class="form-label">共享密钥</label>
				<div class="input-group">
					<input
						type="text"
						name="PSK"
						id="psk"
						value={hex2base64(psk)}
						class="form-control"
						placeholder="共享密钥"
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
				<div class="form-text">填写有助于对抗后量子时代, 写不写都行</div>
			</div>
			<div class="my-3">
				<label for="ice" class="form-label">连接策略</label>
				<Select options={status.ICETags} bind:values={ices}></Select>
				<div class="form-text">
					无 direct 策略的话 ICE 中必须要有 STUN 服务器才可连接, 可避免暴露你的 IP
				</div>
			</div>
			<div class="my-3">
				<label for="whip" class="form-label">WHIP</label>
				{#if status.Linker.length === 0}
					<input
						type="text"
						class="form-control is-invalid"
						readonly
						value="目前无信令服务器, 无法生成可供好友连接的导入链接"
					/>
				{:else}
					<Select options={status.Linker.map((v) => v.Endpoint)} bind:values={whips} expand />
				{/if}
				<div class="form-text">好友将通过此信令服务器连接你</div>
			</div>
		</div>
		<div class="my-3">
			<button type="submit" id="submit" class="btn btn-primary w-100">
				添加并生成给好友的导入链接
			</button>
		</div>
	</form>
</div>

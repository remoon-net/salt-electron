<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { base64Tohex, hex2base64, type Config } from '$lib/config.js'
	import { withPending } from '$lib/pending.svelte.js'
	import xhe, { Target } from '$lib/xhe.js'
	import { tooltip } from '@remoon.net/bootstrap'

	const { data } = $props()
	const status = $state(data.status)
	const pending = withPending()
	const nat = $state(status.NAT)
	import { copyText, copy } from 'svelte-copy'

	async function genkey() {
		let raw = await xhe.get('genkey')
		let [key, pubkey] = JSON.parse(raw) as [string, string]
		status.Key = key
		status.Pubkey = pubkey
	}
	async function handleSubmit(form: FormData) {
		let config: Partial<Config> = {}
		let key = form.get('Key') as string
		config.Key = base64Tohex(key)
		config.Tun = form.get('Tun') as string
		config.Name = form.get('Name') as string
		config.VTun = form.get('VTun') == 'VTun'
		config.Port = Number(form.get('Port'))
		config.NAT = Array.from(form.getAll('NAT') as string[]).filter((s) => !!s.trim())
		if (status.Running) {
			await xhe.stop(Target.Device)
			await xhe.set('settings', '', JSON.stringify(config))
			await xhe.start(Target.Device)
		} else {
			await xhe.set('settings', '', JSON.stringify(config))
		}
		await invalidate('app:status')
		await goto('/')
	}
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			var form = new FormData(e.currentTarget)
			pending.call(() => {
				return handleSubmit(form)
			})
		}}
	>
		<div class="my-3">
			<label for="nickname" class="form-label">此节点昵称</label>
			<div class="input-group">
				<input
					type="text"
					name="Name"
					id="nickname"
					class="form-control"
					placeholder="昵称"
					value={status.Name}
					disabled={pending.value}
				/>
			</div>
			<div class="form-text">用于生成节点链接, 更具辨识度</div>
		</div>
		<div class="my-3">
			<label for="key" class="form-label">私钥 *</label>
			<div class="input-group">
				<input
					type="text"
					name="Key"
					id="key"
					class="form-control"
					placeholder="私钥"
					required
					value={hex2base64(status.Key)}
					disabled={pending.value}
				/>
				<button
					type="button"
					class="btn btn-outline-danger"
					aria-label="重新生成私钥"
					title="点击重新生成私钥"
					use:tooltip
					disabled={pending.value}
					onclick={() => {
						pending.call(() => {
							if (!confirm('警告! 重置私钥将会导致你与已有的好友失去连接')) {
								return
							}
							if (prompt('请输入 "reset key" 以确认进行私钥重置') !== 'reset key') {
								alert('不为 "reset key", 请重试')
								return
							}
							return genkey()
						})
					}}
				>
					<i class="bi bi-arrow-clockwise"></i>
				</button>
			</div>
			<div class="form-text">不要分享给别人</div>
		</div>
		<div class="my-3">
			<label for="pubkey" class="form-label">公钥</label>
			<div class="input-group">
				<input
					type="text"
					name="Pubkey"
					id="pubkey"
					class="form-control"
					placeholder="公钥"
					readonly
					value={hex2base64(status.Pubkey)}
					disabled={pending.value}
				/>
				<button
					type="button"
					class="btn btn-outline-primary"
					aria-label="复制本机公钥"
					use:tooltip={{ title: '点击复制公钥' }}
					onclick={(e) => {
						let text = hex2base64(status.Pubkey)
						copyText(text)
					}}
				>
					<i class="bi bi-copy"></i>
				</button>
			</div>
			<div class="form-text">复制公钥给好友以便生成邀请链接</div>
		</div>
		<div class="my-3">
			<div class="row align-items-center mb-2">
				<div class="col">
					<label for="tun" class="form-label mb-0">Tun</label>
				</div>
				<div class="col col-auto">
					<div class="input-group-text">
						<input
							type="checkbox"
							class="form-check-input mt-0 me-1"
							name="VTun"
							id="vtun"
							value="VTun"
							autocomplete="off"
							checked={status.VTun}
						/>
						<label class="from-check-label" for="vtun">VTun</label>
					</div>
				</div>
			</div>
			<input
				type="text"
				name="Tun"
				id="tun"
				class="form-control"
				placeholder="公钥"
				value={status.Tun}
				disabled={pending.value}
			/>
			<div class="form-text">使用 VTun 将不会将路由添加到系统中, 需要通过 Socks5 代理访问</div>
		</div>
		<div class="row my-3">
			<div class="col">
				<label for="socks5" class="form-label">Socks5</label>
				<input
					type="number"
					name="Socks5"
					id="socks5"
					class="form-control"
					placeholder="端口号"
					min="0"
					max="65535"
					disabled={true || pending.value}
				/>
				<div class="form-text">暂未支持</div>
			</div>
			<div class="col">
				<label for="port" class="form-label">Listen</label>
				<input
					type="number"
					name="Port"
					id="port"
					class="form-control"
					placeholder="公钥"
					min="0"
					max="65535"
					value={status.Port}
					disabled={pending.value}
				/>
				<div class="form-text">固定 Webrtc 端口, 以便防火墙放行</div>
			</div>
			<div class="my-3">
				<div class="row align-items-center mb-2">
					<div class="col">
						<label for="nat-last" class="form-label mb-0">NAT</label>
					</div>
					<div class="col col-auto">
						<button
							type="button"
							class="btn btn-sm btn-outline-primary"
							aria-label="add new route field"
							onclick={() => {
								nat.push('')
							}}
							disabled={pending.value}
						>
							<i class="bi bi-plus-lg"></i>
						</button>
					</div>
				</div>
				{#each nat as a, i}
					<div class="input-group mb-2">
						<input
							type="text"
							name="NAT"
							id={i === nat.length - 1 ? 'nat-last' : ''}
							class="form-control"
							placeholder="路由"
							value={a}
							disabled={pending.value}
						/>
						<button
							type="button"
							class="btn btn-outline-danger"
							aria-label="delete route"
							onclick={() => {
								nat.splice(i, 1)
							}}
							disabled={pending.value}
						>
							<i class="bi bi-trash3"></i>
						</button>
					</div>
				{/each}
				<div class="form-text">添加到系统的路由</div>
			</div>
		</div>
		<div>
			<button type="submit" id="submit" disabled={pending.value} class="btn btn-primary w-100">
				保存并重启
			</button>
		</div>
	</form>
</div>

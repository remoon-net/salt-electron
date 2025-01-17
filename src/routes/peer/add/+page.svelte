<script lang="ts">
	import { withPending } from '$lib/pending.svelte'
	import { collapse, Select, tooltip } from '@remoon.net/bootstrap'
	import xhe from '$lib/xhe.js'
	import { type Peer } from '$lib/config'
	import { goto, invalidate } from '$app/navigation'

	const { data } = $props()
	const status = data.status
	const allows = $state(data.ips)

	const pending = withPending(false)
	let showMore = $state(data.peer !== null)
	let ices = $state(['direct', 'relay'])
	let whips = $state(data.peer?.WHIP ?? [])
	let psk = $state(data.peer?.PSK ?? '')
	async function genpsk() {
		psk = await xhe.get('genpsk')
	}
	async function add(form: FormData) {
		let peer: Peer = {
			Name: form.get('Name') as string,
			Pubkey: form.get('Pubkey') as string,
			PSK: psk,
			ICE: ices,
			Auto: 0,
			WHIP: whips.filter((s) => !!s.trim()),
			Allow: allows,
		}
		{
			let index = status.Peer.findIndex((s) => {
				return s.Pubkey === peer.Pubkey
			})
			if (index != -1) {
				let name = status.Peer[index].Name
				if (!confirm(`有相同公钥的节点(${!!name ? name : '未命名'})存在, 是否进行替换?`)) {
					return
				}
			}
		}
		await xhe.set('peer', 'add', JSON.stringify(peer))
		await invalidate('app:status')
		if (data.peer) {
			await goto(`/`)
		} else {
			await goto(`/peer/edit/?pubkey=${peer.Pubkey}#linker-gen`)
		}
	}

	import { getFAQOpen } from '$lib/../routes/faq.svelte'
	const openFAQ = getFAQOpen()
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			let form = new FormData(e.currentTarget)
			pending.call(() => {
				return add(form)
			})
		}}
	>
		<div class="my-3">
			<label for="name" class="form-label">节点昵称</label>
			<a href="/faq/#nickname" aria-label="昵称详解" onclick={openFAQ}>
				<i class="bi bi-question-circle"></i>
			</a>
			<input
				type="text"
				name="Name"
				id="name"
				class="form-control"
				placeholder="昵称"
				value={data.peer?.Name}
				disabled={pending.value}
			/>
			<div class="form-text">便于分辨节点</div>
		</div>
		<div class="my-3">
			<label for="pubkey" class="form-label">公钥 *</label>
			<a href="/faq/#peer-pubkey" aria-label="节点公钥详解" onclick={openFAQ}>
				<i class="bi bi-question-circle"></i>
			</a>
			<input
				type="text"
				name="Pubkey"
				id="pubkey"
				class="form-control"
				placeholder="公钥"
				required
				value={data.peer?.Pubkey ?? ''}
				disabled={pending.value}
			/>
			<div class="form-text">节点公钥</div>
		</div>
		{#if !data.peer}
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
		{/if}
		<div
			id="more"
			class="collapse"
			class:show={showMore}
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
				<a href="/faq/#psk" aria-label="共享密钥详解" onclick={openFAQ}>
					<i class="bi bi-question-circle"></i>
				</a>
				<div class="input-group">
					<input
						type="text"
						name="PSK"
						id="psk"
						value={psk}
						class="form-control"
						placeholder="共享密钥"
						disabled={pending.value}
						readonly={!!data.peer}
					/>
					<button
						class="btn btn-outline-secondary"
						type="button"
						aria-label="生成共享密钥"
						title="点击随机生成共享密钥"
						use:tooltip
						onclick={genpsk}
						disabled={!!data.peer}
					>
						<i class="bi bi-arrow-clockwise"></i>
					</button>
				</div>
				<div class="form-text">填写有助于对抗后量子时代, 写不写都行</div>
			</div>
			<div class="my-3">
				<label for="ice" class="form-label">连接策略</label>
				<a href="/faq/#ice-policy" aria-label="连接策略详解" onclick={openFAQ}>
					<i class="bi bi-question-circle"></i>
				</a>
				<Select options={status.ICETags} bind:values={ices}></Select>
				<div class="form-text">
					无 direct 策略的话 ICE 中必须要有 STUN 服务器才可连接, 可避免暴露你的 IP
				</div>
			</div>
			<div class="my-3">
				<div class="row align-items-center mb-2">
					<div class="col">
						<label for="whip-last" class="form-label mb-0">WHIP</label>
						<a href="/faq/#whip" aria-label="WHIP详解" onclick={openFAQ}>
							<i class="bi bi-question-circle"></i>
						</a>
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
							required
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
				<div class="form-text">WHIP用于和节点建立连接</div>
			</div>
			<div class="my-3">
				<div class="row align-items-center mb-2">
					<div class="col">
						<label for="allow-last" class="form-label mb-0">Allow</label>
						<a href="/faq/#allow" aria-label="Allow详解" onclick={openFAQ}>
							<i class="bi bi-question-circle"></i>
						</a>
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
							name="NAT"
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
				<div class="form-text">该节点可使用的IP来源地址</div>
			</div>
		</div>
		<div class="my-3">
			<button type="submit" id="submit" class="btn btn-primary w-100"> 添加节点 </button>
		</div>
	</form>
</div>

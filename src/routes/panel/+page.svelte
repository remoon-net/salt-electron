<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	import xhe from '$lib/xhe.js'
	import { Select } from '@remoon.net/bootstrap'
	import { copy, copyText } from 'svelte-copy'

	const { data } = $props()
	const status = $derived(data.status)
	let showNew = $state(true)
	let iceTags = $state(['relay', 'custom'])
	const pending = withPending(false)

	async function addLink(form: FormData) {
		await xhe.set('linker', 'add', form.get('Link') as string)
		await invalidate('app:status')
	}
	async function rmLink(link: string) {
		await xhe.set('linker', 'remove', link)
		await invalidate('app:status')
	}
	async function connectLink(link: string) {
		await xhe.set('linker', 'connect', link)
		await invalidate('app:status')
	}
	async function disconnectLink(link: string) {
		await xhe.set('linker', 'disconnect', link)
		await invalidate('app:status')
	}

	function displayLink(link: string) {
		const u = new URL(link)
		u.hash = ''
		return u.toString()
	}
	$inspect(data)
</script>

<div class="container">
	<div class="my-3">
		<form
			onsubmit={(e) => {
				e.preventDefault()
				const elem = e.currentTarget
				const form = new FormData(elem)
				pending.call(async () => {
					await addLink(form)
					elem.reset()
				})
			}}
		>
			<div class="my-3">
				<label for="link" class="form-label">Linker</label>
				<div class="input-group">
					<input
						type="url"
						name="Link"
						id="link"
						class="form-control"
						placeholder="wss://...."
						required
						disabled={pending.value}
					/>
					<button
						type="submit"
						class="btn btn-outline-primary"
						aria-label="添加"
						disabled={pending.value}
					>
						<i class="bi bi-plus-lg"></i>
					</button>
				</div>
				<div class="form-text">粘贴</div>
			</div>
		</form>
		{#each status.Linker as linker}
			{@const dl = displayLink(linker.Link)}
			<div class="my-3">
				<div class="input-group mb-2">
					<button
						type="button"
						class="btn btn-outline-danger"
						aria-label="移除此链接"
						onclick={() => {
							pending.call(() => {
								return rmLink(linker.Link)
							})
						}}
						disabled={pending.value}
					>
						<i class="bi bi-trash3"></i>
					</button>
					<input
						type="url"
						class="form-control"
						placeholder="链接地址"
						readonly
						value={dl}
						disabled={pending.value}
					/>
					{#if linker.Running}
						<button
							type="button"
							class="btn btn-outline-primary"
							aria-label="停止此链接"
							disabled={pending.value}
							onclick={() => {
								pending.call(() => {
									return disconnectLink(linker.Link)
								})
							}}
						>
							<i class="bi bi-pause"></i>
						</button>
					{:else}
						<button
							type="button"
							class="btn btn-outline-primary"
							aria-label="启动此链接"
							disabled={pending.value}
							onclick={() => {
								pending.call(() => {
									return connectLink(linker.Link)
								})
							}}
						>
							<i class="bi bi-play"></i>
						</button>
					{/if}
				</div>
				<div class="input-group mb-2">
					<input
						type="text"
						name="Key"
						class="form-control"
						value={linker.Endpoint}
						placeholder="互联网连接地址"
						readonly
					/>
					<button
						type="button"
						class="btn btn-outline-primary"
						aria-label="复制"
						disabled={!linker.Endpoint}
						onclick={() => {
							pending.call(() => {
								return copyText(linker.Endpoint)
							})
						}}
					>
						<i class="bi bi-copy"></i>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
<hr />
<div class="container">
	<div class="my-3">
		<div class="row mb-2 align-item-center">
			<div class="col">
				<label for="key" class="form-label mb-0">ICE</label>
			</div>
			<div class="col col-auto">
				<a href="/panel/ice-new/" class="btn btn-sm btn-outline-primary" aria-label="add ice">
					<i class="bi bi-plus-lg"></i>
				</a>
			</div>
		</div>
		<div class="row row-cols-auto mb-2 flex-wrap g-2">
			{#each iceTags as tag}
				<div class="col">
					<div class="input-group">
						<button class="btn btn-sm btn-outline-secondary">{tag}</button>
						{#if !['direct', 'relay'].includes(tag)}
							<button type="button" class="btn btn-sm btn-outline-secondary" aria-label="delete">
								<i class="bi bi-x"></i>
							</button>
						{/if}
					</div>
				</div>
			{/each}
			<div class="col">
				<button class="btn btn-sm btn-outline-primary" aria-label="add">
					<i class="bi bi-plus-lg"></i>
				</button>
			</div>
		</div>
	</div>
	{#each status.ICE as ice}
		<div class="my-3">
			<textarea class="form-control" value={ice} rows="2" name="" id=""></textarea>
			<div class="row g-2 align-items-center">
				<div class="col col-auto">
					<button type="button" class="btn btn-sm btn-outline-danger" aria-label="delete">
						<i class="bi bi-trash3"></i>
					</button>
				</div>
				<div class="col">
					<Select class="text-end" options={status.ICETags}></Select>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.tag {
		display: inline-flex;
	}
</style>

<script lang="ts">
	import { page } from '$app/state'
	import { withPending } from '$lib/pending.svelte'
	import xhe, { sleep } from '$lib/xhe.js'
	import { invalidate } from '$app/navigation'

	interface Props {
		linkers: LinkerStatus[]
	}
	const { linkers: Linkers }: Props = $props()

	const pending = withPending()
	let target = $state('')

	function displayLink(link: string) {
		const u = new URL(link)
		return u.origin
	}
	function viewLink(link: string) {
		const u = new URL('/panel/linker-add/', page.url)
		u.searchParams.set('linker', link)
		return u.toString()
	}

	async function connectLink(link: string) {
		target = link
		return xhe.set('linker', 'connect', link).finally(async () => {
			await sleep()
			await invalidate('app:status')
		})
	}
	async function disconnectLink(link: string) {
		target = link
		return xhe.set('linker', 'disconnect', link).finally(async () => {
			await sleep()
			await invalidate('app:status')
		})
	}

	import { getFAQOpen } from '$lib/../routes/faq.svelte'
	const openFAQ = getFAQOpen()

	import { getSnackbarShow, tooltip } from '@remoon.net/bootstrap'
	import { errStr, type LinkerStatus } from '$lib/config'
	const showSnackbar = getSnackbarShow()
</script>

<div class="container my-3">
	<div class="row align-item-center my-3">
		<div class="col">
			<label for="link" class="form-label">Linker</label>
			<a href="/faq/#linker" aria-label="Linker 详解" onclick={openFAQ}>
				<i class="bi bi-question-circle"></i>
			</a>
		</div>
		<div class="col col-auto">
			<a
				href="/panel/linker-add/"
				class="btn btn-sm btn-outline-primary"
				class:disabled={pending.value}
				aria-label="add whip"
			>
				<i class="bi bi-plus-lg"></i>
			</a>
		</div>
	</div>
	{#if !Linkers.length}
		<div class="text-center my-3">
			<a href="/panel/linker-add/" class="btn btn-outline-primary">添加 Linker</a>
			<div class="form-text">空空如也, 点击上方按钮添加吧</div>
		</div>
	{/if}
	<div class="row g-2 row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xxl-4">
		{#each Linkers as linker}
			{@const dl = displayLink(linker.Link)}
			{@const vl = viewLink(linker.Link)}
			{@const wrong = !!linker.Error}
			<div class="col">
				<div class="input-group mb-2">
					<a
						href={vl}
						class="btn form-control"
						class:btn-outline-primary={!wrong}
						class:btn-outline-danger={wrong}
						class:disabled={pending.value}
						use:tooltip={{ title: !!linker.Error ? linker.Error : 'no err' }}
					>
						{dl}
					</a>
					{#if pending.value && target == linker.Link}
						<button
							class="btn btn-outline-primary"
							aria-label="start"
							type="button"
							disabled={pending.value}
						>
							<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
							<span class="visually-hidden" role="status">Loading...</span>
						</button>
					{:else if linker.Running}
						<button
							type="button"
							class="btn btn-outline-primary"
							aria-label="停止此链接"
							disabled={pending.value}
							onclick={() => {
								pending.call(() => disconnectLink(linker.Link))
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
								pending
									.call(() => connectLink(linker.Link))
									.catch((err) => {
										showSnackbar({
											msg: `启动失败. 错误: ${errStr(err)}`,
											role: 'danger',
										})
									})
							}}
						>
							<i class="bi bi-play"></i>
						</button>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

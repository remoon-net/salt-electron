<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte.js'
	import xhe from '$lib/xhe.js'
	import { getSnackbarShow, Select, getAlert, getConfirm } from '@remoon.net/bootstrap'
	const confirm = getConfirm()

	const { data } = $props()
	const isView = $derived(!!data.linker)

	let linker = $state('')
	let whip = $state('')

	$effect(() => {
		if (!data.linker) {
			return
		}
		const u = new URL(data.linker!)
		whip = u.hash.slice(1)
		u.hash = ''
		linker = u.toString()
	})
	$effect(() => {
		try {
			const u = new URL(linker)
			if (!u.hash.trim().length) {
				return
			}
			whip = u.hash.slice(1)
			u.hash = ''
			linker = u.toString()
		} catch (err) {
			console.error(err)
		}
	})

	const pending = withPending()
	async function handleSubmit(form: FormData) {
		if (isView) {
			if (!(await confirm('是否确认删除此 Linker'))) {
				return
			}
			await xhe.set('linker', 'remove', data.linker!)
		} else {
			const u = new URL(linker)
			u.hash = whip
			await xhe.set('linker', 'add', u.toString())
		}
		await invalidate('app:status')
		await goto('/panel/controller/')
	}

	import { getFAQOpen } from '$lib/../routes/faq.svelte'
	import { errStr } from '$lib/config.js'
	const openFAQ = getFAQOpen()

	const showSnackbar = getSnackbarShow()
	let submitText = $derived(isView ? '删除' : '添加')
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			const form = new FormData(e.currentTarget)
			pending
				.call(() => handleSubmit(form))
				.catch((err) => {
					showSnackbar({
						msg: `${submitText}失败. 错误: ${errStr(err)}`,
						role: 'danger',
					})
				})
		}}
	>
		<div class="my-3">
			<label for="linker" class="form-label">Linker</label>
			<a href="/faq/#linker" aria-label="Linker 详解" onclick={openFAQ}>
				<i class="bi bi-question-circle"></i>
			</a>
			<textarea
				name="Link"
				id="linker"
				class="form-control"
				placeholder="wss://...."
				disabled={pending.value}
				required
				bind:value={linker}
				readonly={isView}
				rows="4"
			></textarea>
			<div class="form-text">粘贴从信令服务提供方那边获取的 Linker</div>
		</div>
		<div class="my-3">
			<label for="whip" class="form-label">WHIP</label>
			<a href="/faq/#whip" aria-label="WHIP详解" onclick={openFAQ}>
				<i class="bi bi-question-circle"></i>
			</a>
			<textarea
				name="WHIP"
				id="whip"
				class="form-control"
				placeholder="http://...."
				bind:value={whip}
				readonly={isView}
				rows="3"
			></textarea>
			<div class="form-text">信令服务提供方提供的用于公开访问的信令地址</div>
		</div>
		<div class="my-3">
			<button
				type="submit"
				class="btn w-100"
				class:btn-primary={!isView}
				class:btn-outline-danger={isView}
				disabled={pending.value}
			>
				{submitText}
			</button>
		</div>
	</form>
</div>

<script lang="ts">
	import { goto, invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte.js'
	import xhe from '$lib/xhe.js'
	import { Select } from '@remoon.net/bootstrap'

	const { data } = $props()
	const isUpdate = $derived(data.index !== null)

	let tags = $state(['relay'])
	let ice = $state('')

	$effect(() => {
		if (!isUpdate) {
			return
		}
		const u = new URL(data.ice)
		tags = !!u.hash ? u.hash.slice(1).split(',') : []
		u.hash = ''
		ice = u.toString()
	})

	const pending = withPending()
	async function handleSubmit(form: FormData) {
		let ice = (form.get('ICE') as string) + '#' + tags.filter((s) => !!s.trim()).join(',')
		if (isUpdate) {
			await xhe.set('ice.set', data.index!, ice)
		} else {
			await xhe.set('ice', 'add', ice)
		}
		await invalidate('app:status')
		await goto('/panel/controller/')
	}

	let customTags = $state([] as string[])
	let opts = $derived.by(() => {
		return data.tags.concat(customTags)
	})

	function addTag() {
		let t = prompt('添加新的 Tag')
		if (typeof t != 'string') {
			return
		}
		customTags.push(t)
		tags.push(t)
	}

	import { getFAQOpen } from '$lib/../routes/faq.svelte'
	const openFAQ = getFAQOpen()
</script>

<div class="container">
	<form
		onsubmit={(e) => {
			e.preventDefault()
			const form = new FormData(e.currentTarget)
			pending.call(() => {
				if (data.ice) {
				}
				return handleSubmit(form)
			})
		}}
	>
		<input type="hidden" name="" />
		<div class="my-3">
			<label for="ICE" class="form-label">ICE Server</label>
			<a href="/faq/#ice-server" aria-label="ICE Server详解" onclick={openFAQ}>
				<i class="bi bi-question-circle"></i>
			</a>
			<textarea
				name="ICE"
				id="ice"
				class="form-control"
				placeholder="turn or stun server"
				disabled={pending.value}
				required
				value={ice}
			></textarea>
			<div class="form-text">ICE Server 用于帮助建立VPN连接</div>
		</div>
		<div class="my-3">
			<div class="row mb-2 align-item-center">
				<div class="col">
					<span class="form-label mb-0">Tags</span>
					<a href="/faq/#ice-tag" aria-label="ICE Tag详解" onclick={openFAQ}>
						<i class="bi bi-question-circle"></i>
					</a>
				</div>
				<div class="col col-auto">
					<button
						type="button"
						class="btn btn-sm btn-outline-primary"
						aria-label="add tag"
						onclick={() => {
							addTag()
						}}
					>
						<i class="bi bi-plus-lg"></i>
					</button>
				</div>
			</div>
			<Select options={opts} bind:values={tags} disabled={pending.value}></Select>
			<div class="form-text">策略分组, 在节点连接策略中会使用到</div>
		</div>
		<div class="my-3">
			<button type="submit" class="btn btn-primary w-100" disabled={pending.value}>
				{data.ice ? '保存' : '新增'}
			</button>
		</div>
	</form>
</div>

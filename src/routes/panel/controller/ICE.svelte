<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	import xhe from '$lib/xhe'
	import { getConfirm, Select } from '@remoon.net/bootstrap'

	const { ice, allTags, index }: { ice: string; allTags: string[]; index: number } = $props()

	const u = new URL(ice)
	let tags = $state(!!u.hash ? u.hash.slice(1).split(',') : [])
	u.hash = ''
	let value = $state(u.toString())

	const pending = withPending()

	async function remove() {
		await xhe.set('ice', 'remove', ice)
		invalidate('app:status')
	}
	const confirm = getConfirm()
</script>

<textarea class="form-control" {value} rows="2" name="" id="" readonly></textarea>
<div class="row g-2 align-items-center">
	<div class="col col-auto">
		<button
			type="button"
			class="btn btn-sm btn-outline-danger"
			aria-label="delete"
			onclick={(e) => {
				e.preventDefault()
				pending.call(async () => {
					if (!(await confirm('确认是否删除此 ICE Server'))) {
						return
					}
					return remove()
				})
			}}
			disabled={pending.value}
		>
			<i class="bi bi-trash3"></i>
		</button>
	</div>
	<div class="col text-end">
		{#if tags.length == 0}
			<button class="btn btn-sm my-1 ms-1 btn-outline-secondary invisible">empty</button>
		{:else}
			{#each tags as t}
				<button class="btn btn-sm my-1 ms-1 btn-outline-secondary">
					{t}
				</button>
			{/each}
		{/if}
	</div>
	<div class="col col-auto">
		<a
			href="/panel/ice-add/?index={index}"
			type="button"
			class="btn btn-sm btn-outline-primary"
			aria-label="edit"
		>
			<i class="bi bi-pencil"></i>
		</a>
	</div>
</div>

<style>
	.tag {
		display: inline-flex;
	}
</style>

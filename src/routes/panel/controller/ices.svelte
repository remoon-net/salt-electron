<script lang="ts">
	interface Props {
		ICEs: string[]
		Tags: string[]
	}
	const { ICEs, Tags }: Props = $props()

	let iceTags = $derived(Tags.filter((s) => s !== 'direct'))

	let selectedTags = $state([])
	let displayICEs = $derived.by(() => {
		return ICEs.map((ice, index) => ({ ice, index })).filter(({ ice }) => {
			if (selectedTags.length === 0) {
				return true
			}
			ice = ice + ','
			for (let t of selectedTags) {
				if (ice.indexOf(t + ',') !== -1) {
					return true
				}
			}
			return false
		})
	})

	import ICE from './ICE.svelte'

	import { getFAQOpen } from '$lib/../routes/faq.svelte'
	const openFAQ = getFAQOpen()
</script>

<div class="container">
	<div class="my-3">
		<div class="row mb-2 align-item-center">
			<div class="col">
				<span class="form-label mb-0">ICE</span>
				<a href="/faq/#ice-server" aria-label="Linker 详解" onclick={openFAQ}>
					<i class="bi bi-question-circle"></i>
				</a>
			</div>
			<div class="col col-auto">
				<a href="/panel/ice-add/" class="btn btn-sm btn-outline-primary" aria-label="add ice">
					<i class="bi bi-plus-lg"></i>
				</a>
			</div>
		</div>
		<div class="row row-cols-auto mb-2 flex-wrap g-2">
			{#each iceTags as tag}
				{@const id = `ice-tag-${tag}`}
				<div class="col">
					<input
						type="checkbox"
						class="btn-check"
						{id}
						autocomplete="off"
						value={tag}
						bind:group={selectedTags}
					/>
					<label for={id} class="btn btn-sm btn-outline-secondary">{tag}</label>
				</div>
			{/each}
		</div>
	</div>
	{#if !ICEs.length}
		<div class="text-center">
			<a href="/panel/ice-add/" class="btn btn-outline-primary">添加 ICE Server</a>
			<div class="form-text">空空如也, 点击上方按钮添加吧</div>
		</div>
	{/if}
	{#each displayICEs as { ice, index }}
		<div class="my-3">
			<ICE allTags={iceTags} {ice} {index}></ICE>
		</div>
	{/each}
</div>

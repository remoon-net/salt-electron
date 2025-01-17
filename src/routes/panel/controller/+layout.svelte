<script>
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	const pending = withPending()
	import TopNavbar from '$lib/TopNavbar.svelte'
</script>

{#snippet right()}
	<button
		type="button"
		class="btn loading"
		disabled={pending.value}
		onclick={() => {
			pending.call(() => invalidate('app:status'), 500)
		}}
	>
		{#if pending.value}
			<span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
		{:else}
			<i class="bi bi-arrow-clockwise"></i>
		{/if}
		刷新
	</button>
{/snippet}

<TopNavbar {right}></TopNavbar>

<slot></slot>

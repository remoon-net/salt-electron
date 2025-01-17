<script>
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	const pending = withPending()
	import TopNavbar from '$lib/TopNavbar.svelte'
</script>

{#snippet right()}
	<a href="/" class="btn">
		<i class="bi bi-house"></i>
		主页
	</a>
{/snippet}
{#snippet left()}
	<a href="/panel/controller/" type="button" class="btn">
		<i class="bi bi-chevron-left"></i>
		返回
	</a>
{/snippet}
<TopNavbar {right} {left}></TopNavbar>
<slot></slot>

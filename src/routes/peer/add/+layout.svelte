<script>
	import TopNavbar from '$lib/TopNavbar.svelte'
</script>

{#snippet right()}
	<label for="submit" class="btn">
		<i class="bi bi-floppy"></i>
		添加
	</label>
{/snippet}

<TopNavbar right={right}></TopNavbar>

<slot></slot>

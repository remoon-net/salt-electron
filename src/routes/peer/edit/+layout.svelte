<script>
	import TopNavbar from '$lib/TopNavbar.svelte'
</script>

{#snippet right()}
	<a href="#linker-gen" data-bs-toggle="modal" class="btn">
		<i class="bi bi-share"></i>
		连接
	</a>
{/snippet}

<TopNavbar {right}></TopNavbar>

<slot></slot>

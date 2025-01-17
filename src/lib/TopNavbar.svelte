<script lang="ts">
	import { page } from '$app/state'
	import type { Snippet } from 'svelte'
	interface Props {
		right?: () => ReturnType<Snippet<[]>>
		left?: () => ReturnType<Snippet<[]>>
	}
	const { right, left }: Props = $props()
</script>

<header class="bg-body">
	<nav class="navbar border-bottom py-1">
		<div class="container">
			<div class="col col-auto left">
				{#if left}
					{@render left()}
				{:else}
					<a href="/" class="btn">
						<i class="bi bi-house"></i>
						主页
					</a>
				{/if}
			</div>
			<div class="col text-center">{page.data.titles.slice(-1)[0]}</div>
			<div class="col col-auto right">
				{#if right}
					{@render right()}
				{:else}
					<label for="submit" class="btn">
						<i class="bi bi-floppy"></i>
						保存
					</label>
				{/if}
			</div>
		</div>
	</nav>
</header>

<style>
	header {
		position: sticky;
		top: 0;
		z-index: 99;
	}
	.left :global(.btn) {
		/* position: relative; */
		margin-left: -0.375rem;
	}
	.right :global(.btn) {
		/* position: relative; */
		margin-right: -0.375rem;
	}
</style>

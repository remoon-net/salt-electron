<script lang="ts">
	import '../app.scss'
	import 'bootstrap'
	import { Snackbar } from '@remoon.net/bootstrap'
	import FAQ from './faq.svelte'

	import { page } from '$app/state'
	const title = $derived.by(() => Array.from<string>(page.data.titles).reverse().join(' - '))
</script>

<svelte:head>
	<title>
		{title}
	</title>
</svelte:head>

<Snackbar>
	{#if !page.url.pathname.startsWith('/faq')}
		<FAQ>
			<slot></slot>
		</FAQ>
	{:else}
		<slot></slot>
	{/if}
</Snackbar>

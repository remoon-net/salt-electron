<script>
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	const pending = withPending()
</script>

<div class="row align-items-center">
	<div class="col col-auto">
		<a
			href="/panel/"
			type="button"
			class="btn"
			onclick={(e) => {
				e.preventDefault()
				history.back()
			}}
		>
			<i class="bi bi-chevron-left"></i>
			返回
		</a>
	</div>
	<div class="col text-center">www</div>
	<div class="col col-auto">
		<a href="/" class="btn">
			<i class="bi bi-house"></i>
			主页
		</a>
	</div>
</div>
<slot></slot>

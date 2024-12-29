<script>
	import { invalidate } from '$app/navigation'
	import { withPending } from '$lib/pending.svelte'
	const pending = withPending()
</script>

<div class="row align-items-center">
	<div class="col col-auto">
		<a href="/" class="btn">
			<i class="bi bi-house"></i>
			主页
		</a>
	</div>
	<div class="col text-center">www</div>
	<div class="col col-auto">
		<button
			type="button"
			class="btn"
			disabled={pending.value}
			onclick={() => {
				pending.call(() => {
					return invalidate('app:status')
				})
			}}
		>
			<i class="bi bi-arrow-clockwise"></i>
			刷新
		</button>
	</div>
</div>
<slot></slot>

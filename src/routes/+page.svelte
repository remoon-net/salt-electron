<script lang="ts">
	import xhe from '$lib/xhe'

	async function start() {
		const ret = await xhe.start()
		alert(`ohhhh ${ret.value}`)
	}
</script>

<button onclick={start}>click me</button>

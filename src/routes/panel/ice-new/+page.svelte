<script lang="ts">
	import { Select } from '@remoon.net/bootstrap'

	const { data } = $props()
	let ices = $state(['direct', 'relay'])
</script>

<div class="container">
	<form>
		<div class="my-3">
			<label for="key" class="form-label">Linker</label>
			<textarea class="form-control" placeholder="私钥"></textarea>
			<div class="form-text">不要分享给别人</div>
		</div>
		<div class="my-3">
			<label for="key" class="form-label">Linker</label>
			<Select options={data.tags} bind:values={ices}></Select>
			<div class="form-text">不要分享给别人</div>
		</div>
		<div class="my-3">
			<button type="submit" class="btn btn-primary w-100">新增</button>
		</div>
	</form>
</div>

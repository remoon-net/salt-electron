<script lang="ts">
	import { Select } from '@remoon.net/bootstrap'

	const { data } = $props()
	const status = data.status
	let showNew = $state(true)
	let iceTags = $state(['relay', 'custom'])
</script>

<div class="container">
	<div class="my-3">
		<div class="my-3">
			<label for="key" class="form-label">Linker</label>
			<div class="input-group">
				<input type="text" name="Key" id="key" class="form-control" placeholder="私钥" />
				<button type="submit" class="btn btn-outline-primary" aria-label="重新生成私钥">
					<i class="bi bi-plus-lg"></i>
				</button>
			</div>
			<div class="form-text">不要分享给别人</div>
		</div>
		{#each status.Linker as linker}
			<div class="my-3">
				<div class="input-group mb-2">
					<button type="button" class="btn btn-outline-danger" aria-label="重新生成私钥">
						<i class="bi bi-trash3"></i>
					</button>
					<input type="text" name="Key" id="key" class="form-control" placeholder="私钥" required />
					<button type="button" class="btn btn-outline-primary" aria-label="重新生成私钥">
						<i class="bi bi-play"></i>
					</button>
				</div>
				<div class="input-group mb-2">
					<input
						type="text"
						name="Key"
						class="form-control"
						value={linker.Endpoint}
						placeholder="私钥"
						readonly
					/>
					<button type="button" class="btn btn-outline-primary" aria-label="重新生成私钥">
						<i class="bi bi-copy"></i>
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
<hr />
<div class="container">
	<div class="my-3">
		<div class="row mb-2 align-item-center">
			<div class="col">
				<label for="key" class="form-label mb-0">ICE</label>
			</div>
			<div class="col col-auto">
				<a href="/panel/ice-new/" class="btn btn-sm btn-outline-primary" aria-label="add ice">
					<i class="bi bi-plus-lg"></i>
				</a>
			</div>
		</div>
		<div class="row row-cols-auto mb-2 flex-wrap g-2">
			{#each iceTags as tag}
				<div class="col">
					<div class="input-group">
						<button class="btn btn-sm btn-outline-secondary">{tag}</button>
						{#if !['direct', 'relay'].includes(tag)}
							<button type="button" class="btn btn-sm btn-outline-secondary" aria-label="delete">
								<i class="bi bi-x"></i>
							</button>
						{/if}
					</div>
				</div>
			{/each}
			<div class="col">
				<button class="btn btn-sm btn-outline-primary" aria-label="add">
					<i class="bi bi-plus-lg"></i>
				</button>
			</div>
		</div>
	</div>
	{#each status.ICE as ice}
		<div class="my-3">
			<textarea class="form-control" value={ice} rows="2" name="" id=""></textarea>
			<div class="row g-2 align-items-center">
				<div class="col col-auto">
					<button type="button" class="btn btn-sm btn-outline-danger" aria-label="delete">
						<i class="bi bi-trash3"></i>
					</button>
				</div>
				<div class="col">
					<Select class="text-end" options={status.ICETags}></Select>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.tag {
		display: inline-flex;
	}
</style>

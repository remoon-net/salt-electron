<script lang="ts" module>
	import { getContext, setContext } from 'svelte'

	export const key = Symbol('link')

	interface Opener {
		(link: string): void
		(e: MouseEvent & { currentTarget: EventTarget & HTMLAnchorElement }): void
	}

	export function getFAQOpen() {
		return getContext(key) as Opener
	}
</script>

<script lang="ts">
	import { dev } from '$app/environment'
	import { modal } from '@remoon.net/bootstrap'
	import { Modal } from 'bootstrap'

	let devClass = ''
	if (dev) {
		// devClass = 'd-block show'
	}
	let root = $state<HTMLElement>()
	let link = $state('/faq/')
	let faq = $state<HTMLIFrameElement>()
	const opener: Opener = (e) => {
		if (typeof e === 'string') {
			link = e
		} else {
			e.preventDefault()
			link = e.currentTarget.href
		}
		Modal.getOrCreateInstance(root!).show()
	}
	setContext(key, opener)
</script>

<div
	class="modal fade {devClass}"
	id="faq"
	tabindex="-1"
	use:modal
	bind:this={root}
	onshown.bs.modal={() => {
		faq!.contentWindow!.location = link
	}}
>
	<div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">FAQ (名词解释)</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<iframe bind:this={faq} class="modal-body p-0" src="/faq/" title="FAQ名词解释" frameborder="0"
			></iframe>
			<!-- <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"> 关闭 </button>
			</div> -->
		</div>
	</div>
</div>

<slot></slot>

<style>
	.modal-content {
		min-height: 600px;
	}
</style>

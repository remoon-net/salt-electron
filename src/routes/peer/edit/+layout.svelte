<script>
	import { page } from '$app/stores'
</script>

<div class="row align-items-center">
	<div class="col col-auto">
		<a href="/" class="btn">
			<i class="bi bi-house"></i>
			主页
		</a>
	</div>
	<div class="col text-center">节点详情</div>
	<div class="col col-auto">
		<a href="#linker-gen" data-bs-toggle="modal" class="btn">
			<i class="bi bi-share"></i>
			连接
		</a>
	</div>
</div>
<slot></slot>

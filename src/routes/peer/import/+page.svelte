<div class="container">
	<form action="/peer/edit/?preview">
		<div class="my-3">
			<label for="peer" class="form-label">解析好友链接</label>
			<textarea class="form-control" id="peer" rows="5" required placeholder="peer://"></textarea>
			<div class="form-text">好友链接使用了公钥加密</div>
		</div>
		<div>
			<button type="submit" class="btn btn-primary w-100">解析</button>
		</div>
	</form>
</div>

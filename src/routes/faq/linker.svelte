<div class="container my-3" id="linker">
	<h5>Linker</h5>
	<p>Linker 用于对外提供信令服务, 目前支持两种协议 http 和 wss</p>
	<dl>
		<dt>wss linker</dt>
		<dd>
			连接信令服务提供方提供的 wss 链接以便对外提供服务, 格式为
			<code>wss://whip-provider.host/path#wss://whip-endpoint/path</code>, 一般都是用这个, 比较省心
		</dd>
	</dl>
	<dl>
		<dt>http linker</dt>
		<dd>
			格式为 <code>http://0.0.0.0:8999#[wss://whip-endpoint/path]</code>, 这里的
			<code>whip-endpoint</code> 一般来说都是反代地址, 只要其它节点能访问到都行
		</dd>
	</dl>
</div>

<style>
	code {
		word-break: break-all;
	}
</style>

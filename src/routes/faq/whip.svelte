<div class="container my-3" id="whip">
	<h5>信令地址 (WHIP)</h5>
	<p>
		访问节点的信令地址交换连接信息建立连接, 是http连接, 上方的 <code>http linker</code>
		就是原始的信令服务, <code>wss linker</code> 只是通过 <code>yamux</code> 将
		<code>http linker</code> 反向代理到服务器上暴露信令地址供其它节点连接
	</p>
</div>

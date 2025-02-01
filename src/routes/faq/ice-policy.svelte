<div class="container my-3" id="ice-policy">
	<h5>连接策略</h5>
	<p></p>
	<dl>
		<dt><code>direct</code></dt>
		<dd>
			直连, 对方节点会知晓你的IP地址以便进行直连, 移除此项将只能通过 ICE Server 中的 TURN server
			进行中继连接, 如果没有可用的 turn server 将无法连接
		</dd>
	</dl>
	<dl>
		<dt><code>nowsc</code></dt>
		<dd>
			禁止使用 Linker 的 WebSocket 通道辅助建立连接. 默认是启用的,
			因为可以帮助节点快速建立连接虽然会消耗更多 Linker 的流量. 禁用的话会导致连接时间过长,
			但可以节省流量
		</dd>
	</dl>
	<dl>
		<dt><code>relay</code></dt>
		<dd>所有 ICE Server 默认都有这个 tag, 帮助节点建立连接</dd>
	</dl>
</div>

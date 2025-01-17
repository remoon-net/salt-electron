<script>
	const code = `func ParseICEServer(u *url.URL) webrtc.ICEServer {
	link := u.Scheme + ":" + u.Hostname() + ":" + u.Port()
	transport := u.Query().Get("transport")
	if transport != "" && (transport == "tcp" || transport == "udp") {
		link = link + "?transport=" + transport
	}
	ice := webrtc.ICEServer{
		URLs:           []string{link},
		CredentialType: webrtc.ICECredentialTypePassword,
	}
	if uinfo := u.User; uinfo != nil {
		ice.Username = uinfo.Username()
		ice.Credential, _ = uinfo.Password()
	}
	return ice
}
`
</script>

<div class="container my-3" id="ice-server">
	<h5>ICE Server</h5>
	<p>
		ICE Server 用来帮助无法直连的节点建立连接.<br />
		和标准的Webrtc Server不一样, 因为标准没有给出一行的链接格式. 所以自创了一个链接格式. 仅支持 username:password
		的验证方式, 如果你想作为 ICE Server 服务提供方可以参考以下代码生成可用于 Salt VPN 的 ICE Server 链接
		<br />
	</p>
	<pre><code>{code}</code></pre>
</div>

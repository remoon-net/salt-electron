export async function load({ parent }) {
	const { titles } = await parent()
	return {
		titles: [...titles, '本机节点设置'],
	}
}

export async function load({ parent }) {
	let { titles } = await parent()
	return {
		titles: [...titles, '添加节点'],
	}
}

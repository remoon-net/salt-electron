export async function load({ parent }) {
	let { titles } = await parent()
	return {
		titles: [...titles, '好友节点设置'],
	}
}

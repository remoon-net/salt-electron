export async function load({ parent }) {
	const { titles } = await parent()
	return {
		titles: [...titles, '连接中心'],
	}
}

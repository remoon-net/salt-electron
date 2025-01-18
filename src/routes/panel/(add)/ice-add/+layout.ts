export async function load({ parent }) {
	const { titles } = await parent()
	return {
		titles: [...titles, '添加 ICE Server'],
	}
}

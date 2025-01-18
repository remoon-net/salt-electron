export async function load({ parent, url }) {
	const { titles } = await parent()
	return {
		titles: [...titles, url.searchParams.has('linker') ? '查看 Linker' : '添加 Linker'],
	}
}

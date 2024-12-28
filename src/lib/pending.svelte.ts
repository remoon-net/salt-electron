export function withPending(init = false) {
	const pending = $state({
		value: init,
		async call<T = any>(fn: () => T | Promise<T>): Promise<T> {
			if (pending.value) {
				return Promise.reject()
			}
			pending.value = true
			let p = Promise.resolve().then(fn)
			p.finally(() => {
				pending.value = false
			})
			return p
		},
	})
	return pending
}

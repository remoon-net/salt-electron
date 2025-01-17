export function withPending(init = false) {
	const pending = $state({
		value: init,
		async call<T = any>(fn: () => T | Promise<T>, min: number = 0): Promise<T> {
			if (pending.value) {
				return Promise.reject()
			}
			pending.value = true
			let p = Promise.resolve().then(fn)
			let tasks = [p]
			if (min != 0) {
				tasks.push(new Promise((rl) => setTimeout(rl, min)))
			}
			Promise.all(tasks).finally(() => {
				pending.value = false
			})
			return p
		},
	})
	return pending
}

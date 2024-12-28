import { Address4, Address6 } from 'ip-address'

export function Address(cidr: string) {
	try {
		return new Address4(cidr)
	} catch {}
	try {
		return new Address6(cidr)
	} catch {}
}

export { Address4, Address6 }

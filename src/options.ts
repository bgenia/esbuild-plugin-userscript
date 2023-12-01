import type { Options as InjectOptions } from "./plugins/inject-code"
import type { Options as ProxyOptions } from "./plugins/proxy"
import type { Metadata } from "./shared/metadata"

export type UserscriptOptions = {
	metadata: Metadata
	inject?: InjectOptions[]
	proxy?: ProxyOptions
}

export function resolveOptions(options: UserscriptOptions) {
	return {
		...options,
		inject: options.inject ?? [],
	}
}

export type ResolvedOptions = ReturnType<typeof resolveOptions>

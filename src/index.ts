import { resolveOptions, type UserscriptOptions } from "./options"
import { userscriptInjectCode } from "./plugins/inject-code"
import { userscriptMetadata } from "./plugins/metadata"
import { userscriptProxy } from "./plugins/proxy"
import { applyPlugins } from "./shared/applyPlugins"
import { definePlugin } from "./shared/definePlugin"

export function userscript(options: UserscriptOptions) {
	return definePlugin({
		name: "esbuild-plugin-userscript",
		setup(build) {
			const resolvedOptions = resolveOptions(options)

			applyPlugins(build, [userscriptMetadata(resolvedOptions.metadata)])

			for (const injection of resolvedOptions.inject) {
				applyPlugins(build, [userscriptInjectCode(injection)])
			}

			if (resolvedOptions.proxy) {
				applyPlugins(build, [userscriptProxy(resolvedOptions.proxy)])
			}
		},
	})
}

export namespace userscript {
	export const metadata = userscriptMetadata
	export const injectCode = userscriptInjectCode
	export const proxy = userscriptProxy
}

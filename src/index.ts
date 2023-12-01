import { userscriptMetadata } from "@/plugins/metadata"
import { userscriptProxy } from "@/plugins/proxy"
import { definePlugin } from "@/shared/definePlugin"

type Intersection<U> = (U extends U ? (_: U) => void : never) extends (
	_: infer R,
) => void
	? R
	: never

type Options = Intersection<Parameters<(typeof plugins)[number]>[0]>

export function userscript(options: Options) {
	return definePlugin({
		name: "esbuild-plugin-userscript",
		setup(build) {
			for (const plugin of plugins) {
				plugin(options).setup(build)
			}
		},
	})
}

export namespace userscript {
	export const metadata = userscriptMetadata
	export const proxy = userscriptProxy
}

const plugins = Object.values(
	userscript,
) as (typeof userscript)[keyof typeof userscript][]

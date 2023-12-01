import { userscriptInjectCode } from "@/plugins/inject-code"
import { applyPlugins } from "@/shared/applyPlugins"
import { definePlugin } from "@/shared/definePlugin"
import { formatMetadata, type Metadata } from "@/shared/metadata"

export type Options = Metadata

export function userscriptMetadata(options: Options) {
	return definePlugin({
		name: "esbuild-plugin-userscript-metadata",
		setup(build) {
			const metadata = formatMetadata(options)

			applyPlugins(build, [
				userscriptInjectCode({
					at: ["start"],
					code: `${metadata}\n`,
				}),
			])
		},
	})
}

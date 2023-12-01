import { createHash } from "node:crypto"
import { join } from "node:path"
import { definePlugin } from "@/shared/definePlugin"
import { formatMetadata, type Metadata } from "@/shared/metadata"

type Proxy = {
	port: number
	// Inferred automatically
	path: string | undefined
	// Inferred automatically
	file: string | undefined
}

type Options = {
	metadata: Metadata
	proxy: Proxy
}

const template = (proxy: Proxy) => `
(async function () {
	GM.xmlHttpRequest({
		method: "GET",
		url: "http://127.0.0.1:${proxy.port}${proxy.path}${proxy.file}",
		onload: function(response) {
			eval(response.responseText)
		},
	})
})()
`

export const userscriptProxy = (options: Options) =>
	definePlugin({
		name: "esbuild-plugin-userscript-proxy",
		setup(build) {
			build.onEnd((result) => {
				if (!result.outputFiles) {
					return
				}

				const { proxy, metadata } = options

				const encoder = new TextEncoder()

				proxy.path = result.outputFiles[0]!.path.replace(build.initialOptions.outdir!, "")

				const text = `${formatMetadata({
					...metadata,
					grant: ["GM.xmlHttpRequest", ...(metadata.grant ?? [])],
					connect: ["127.0.0.1", ...(metadata.connect ?? [])],
				})}\n\n${template(proxy)}`

				result.outputFiles.push({
					path: join(build.initialOptions.outdir!, `bundle.proxy.user.js`),
					contents: encoder.encode(text),
					hash: createHash("md5").update(text).digest("hex"),
					text,
				})
			})
		},
	})

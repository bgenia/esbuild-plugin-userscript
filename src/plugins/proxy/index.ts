import { source } from "common-tags"
import type { OutputFile, PluginBuild } from "esbuild"
import { createHash } from "node:crypto"
import { relative } from "node:path"
import { definePlugin } from "@/shared/definePlugin"
import { formatMetadata, type Metadata } from "@/shared/metadata"

type ProxyTargets = string[] | ((file: OutputFile) => boolean)

export type Options = {
	metadata?: Metadata
	port?: number
	targets?: ProxyTargets
	outFile?: (targetPath: string) => string
}

function resolveOutFile(targetPath: string, options: Options) {
	if (!options.outFile) {
		return targetPath.replace(/^.*?\./, "$&proxy.")
	}

	return options.outFile(targetPath)
}

function createProxyScript(
	build: PluginBuild,
	target: OutputFile,
	options: Options,
) {
	const metadata: Metadata = {
		...options.metadata,
		grant: ["GM.xmlHttpRequest", ...(options.metadata?.grant ?? [])],
		connect: ["127.0.0.1", ...[options.metadata?.connect ?? []].flat()],
	}

	const filePath = resolveOutFile(target.path, options)
	const proxyPath = relative(build.initialOptions.outdir ?? "dist", filePath)

	const text = source`
		${formatMetadata(metadata)}

		(async function () {
			GM.xmlHttpRequest({
				method: "GET",
				url: "http://127.0.0.1:${options.port ?? "8080"}/${proxyPath}",
				onload: function(response) {
					eval(response.responseText)
				},
			})
		})()
	`

	const encoder = new TextEncoder()

	const proxyScriptFile: OutputFile = {
		path: filePath,
		contents: encoder.encode(text),
		hash: createHash("md5").update(text).digest("hex"),
		text,
	}

	return proxyScriptFile
}

function validateTarget(file: OutputFile, targets?: ProxyTargets) {
	if (!targets) {
		return true
	}

	if (Array.isArray(targets) && !targets.includes(file.path)) {
		return false
	}

	if (!Array.isArray(targets) && !targets(file)) {
		return false
	}

	return true
}

export function userscriptProxy(options: Options = {}) {
	return definePlugin({
		name: "esbuild-plugin-userscript-proxy",
		setup(build) {
			build.onEnd((result) => {
				if (!result.outputFiles) {
					return
				}

				for (const file of Array.from(result.outputFiles)) {
					if (!validateTarget(file, options.targets)) {
						continue
					}

					const proxyFile = createProxyScript(build, file, options)

					result.outputFiles.push(proxyFile)
				}
			})
		},
	})
}

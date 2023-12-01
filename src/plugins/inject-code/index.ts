import { source } from "common-tags"
import type { OutputFile } from "esbuild"
import { definePlugin } from "@/shared/definePlugin"

export type Options = {
	at: ("start" | "end")[]
	code: string | ((file: OutputFile) => string)
}

export function userscriptInjectCode(options: Options) {
	return definePlugin({
		name: "esbuild-plugin-userscript-inject-code",
		setup(build) {
			const { at, code } = options

			build.onEnd((result) => {
				if (!result.outputFiles) {
					return
				}

				const encoder = new TextEncoder()
				for (const [i, file] of result.outputFiles.entries()) {
					const resultFile = result.outputFiles[i]

					if (!resultFile) {
						continue
					}

					const codeText = typeof code === "function" ? code(file) : code

					let resultText = file.text

					if (at.includes("start")) {
						resultText = source`
							${codeText}
							${resultFile}
						`
					}

					if (at.includes("end")) {
						resultText = source`
							${resultFile}
							${codeText}
						`
					}

					resultFile.contents = encoder.encode(resultText)
				}
			})
		},
	})
}

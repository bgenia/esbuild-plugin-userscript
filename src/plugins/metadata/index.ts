import { definePlugin } from "@/shared/definePlugin"
import { formatMetadata, type Metadata } from "@/shared/metadata"

type Options = {
	metadata: Metadata
}

export const userscriptMetadata = (options: Options) =>
	definePlugin({
		name: "esbuild-plugin-userscript-metadata",
		setup(build) {
			build.onEnd((result) => {
				if (!result.outputFiles) {
					return
				}

				const encoder = new TextEncoder()

				const metadata = formatMetadata(options.metadata)

				for (const [i, file] of result.outputFiles.entries()) {
					const resultFile = result.outputFiles[i]

					if (!resultFile) {
						continue
					}

					resultFile.contents = encoder.encode(
						`${metadata}\n\n\n${file.text}`,
					)
				}
			})
		},
	})

import { defineConfig } from "tsup"

// eslint-disable-next-line import/no-default-export
export default defineConfig({
	entry: ["src/index.ts"],
	outDir: "build",
	format: ["esm", "cjs"],
	dts: true,
})

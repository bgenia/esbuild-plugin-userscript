import type { Plugin, PluginBuild } from "esbuild"

export function applyPlugins(build: PluginBuild, plugins: Plugin[]) {
	return Promise.all(plugins.map((plugin) => plugin.setup(build)))
}

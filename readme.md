# esbuild-plugin-userscript

ESbuild plugin(s) for userscripts.

Available plugins:

- `userscript-inject-code` - Injects code fragment into compiled userscript
- `userscript-metadata` - Injects metadata comments
- `userscript-proxy` - Generates proxy scripts to bypass browser cache

## Usage

As a single plugin:

```ts
import { userscript } from "esbuild-plugin-userscript"

build({
  plugins: [
    userscript({
      // ...
    })
  ]
})
```

As separate plugins:

```ts
import { userscript } from "esbuild-plugin-userscript"

build({
  plugins: [
    userscript.metadata({
      // ...
    })
  ]
})
```

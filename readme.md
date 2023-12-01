# esbuild-plugin-userscript

ESbuild plugin(s) for userscripts.

Available plugins:

- `userscript-metadata` - Injects metadata comments

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

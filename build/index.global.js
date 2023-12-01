"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/shared/definePlugin.ts
  function definePlugin(plugin) {
    return plugin;
  }
  __name(definePlugin, "definePlugin");

  // src/shared/metadata.ts
  function formatAuthor(author) {
    if (typeof author === "string")
      return author;
    let { name } = author;
    if (author.email) {
      name += ` <${author.email}>`;
    }
    if (author.url) {
      name += ` (${author.url})`;
    }
    return name;
  }
  __name(formatAuthor, "formatAuthor");
  function getMaxLength(strings) {
    return strings.map((item) => item.length).reduce((a, b) => Math.max(a, b), 0);
  }
  __name(getMaxLength, "getMaxLength");
  function formatField(key, value) {
    if (typeof value === "string") {
      return [
        [
          key,
          value
        ]
      ];
    }
    if (Array.isArray(value)) {
      return value.map((item) => [
        key,
        item
      ]);
    }
    if (value === void 0 || value === null) {
      return [];
    }
    const properties = Object.entries(value);
    return properties.map(([key2, value2]) => {
      if (key2 === "") {
        return [
          `${key2}`,
          value2
        ];
      }
      return [
        `${key2}:${key2}`,
        value2
      ];
    });
  }
  __name(formatField, "formatField");
  function normalizeResources(resources) {
    if (Array.isArray(resources)) {
      return resources;
    }
    const pad = getMaxLength(Object.keys(resources));
    return Object.entries(resources).map(([key, value]) => {
      return `${key.padEnd(pad)} ${value}`;
    });
  }
  __name(normalizeResources, "normalizeResources");
  function formatMetadata(metadata) {
    const formattedProperties = [];
    for (const [key, value] of Object.entries(metadata)) {
      if (value === void 0 || value === null) {
        continue;
      }
      if (key === "author") {
        formattedProperties.push([
          key,
          formatAuthor(value)
        ]);
        continue;
      }
      if (key === "resource") {
        formattedProperties.push(...formatField(key, normalizeResources(value)));
        continue;
      }
      formattedProperties.push(...formatField(key, value));
    }
    const valuePadding = getMaxLength(formattedProperties.map((x) => x[0])) + 3;
    const joinedProperties = formattedProperties.map(([key, value]) => `// @${key.padEnd(valuePadding)}${value}`.trimEnd()).join("\n");
    const formattedMetadata = `// ==UserScript==
${joinedProperties}// ==/UserScript==`;
    return formattedMetadata;
  }
  __name(formatMetadata, "formatMetadata");

  // src/plugins/metadata/index.ts
  var userscriptMetadata = /* @__PURE__ */ __name((options) => definePlugin({
    name: "esbuild-plugin-userscript-metadata",
    setup(build) {
      build.onEnd((result) => {
        if (!result.outputFiles) {
          return;
        }
        const encoder = new TextEncoder();
        const metadata = formatMetadata(options.metadata);
        for (const [i, file] of result.outputFiles.entries()) {
          const resultFile = result.outputFiles[i];
          if (!resultFile) {
            continue;
          }
          resultFile.contents = encoder.encode(`${metadata}
${file.text}`);
        }
      });
    }
  }), "userscriptMetadata");

  // src/index.ts
  function userscript(options) {
    return definePlugin({
      name: "esbuild-plugin-userscript",
      setup(build) {
        for (const plugin of plugins) {
          plugin(options).setup(build);
        }
      }
    });
  }
  __name(userscript, "userscript");
  (function(userscript2) {
    userscript2.metadata = userscriptMetadata;
  })(userscript || (userscript = {}));
  var plugins = Object.values(userscript);
  console.log(plugins);
})();

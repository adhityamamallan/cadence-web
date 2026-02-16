# Lockfile changes: v4.0.16-rc.02 -> v4.0.16-rc.03

Triggered by 4 dependency-bump PRs (#1325, #1326, #1329, #1331). `npm install` re-resolved the full transitive tree, so the lockfile churn extends well beyond the packages named in those PR descriptions.

## Changed (140)

| Package | Before | After |
|---|---|---|
| `@adobe/css-tools` | 4.3.3 | 4.5.0 |
| `@babel/code-frame` | 7.28.6 | 7.29.7 |
| `@babel/compat-data` | 7.24.4 | 7.29.7 |
| `@babel/core` | 7.24.4 | 7.29.7 |
| `@babel/generator` | 7.24.4 | 7.29.7 |
| `@babel/helper-compilation-targets` | 7.23.6 | 7.29.7 |
| `@babel/helper-module-imports` | 7.24.3 | 7.29.7 |
| `@babel/helper-module-transforms` | 7.23.3 | 7.29.7 |
| `@babel/helper-plugin-utils` | 7.24.0 | 7.29.7 |
| `@babel/helper-string-parser` | 7.27.1 | 7.29.7 |
| `@babel/helper-validator-identifier` | 7.28.5 | 7.29.7 |
| `@babel/helper-validator-option` | 7.23.5 | 7.29.7 |
| `@babel/helpers` | 7.28.6 | 7.29.7 |
| `@babel/parser` | 7.28.6 | 7.29.7 |
| `@babel/plugin-syntax-jsx` | 7.24.1 | 7.29.7 |
| `@babel/plugin-syntax-typescript` | 7.24.1 | 7.29.7 |
| `@babel/template` | 7.28.6 | 7.29.7 |
| `@babel/traverse` | 7.24.1 | 7.29.7 |
| `@babel/types` | 7.28.6 | 7.29.7 |
| `@eslint/js` | 8.57.0 | 8.57.1 |
| `@grpc/proto-loader` | 0.7.13 | 0.7.15 |
| `@humanwhocodes/config-array` | 0.11.14 | 0.13.0 |
| `@humanwhocodes/object-schema` | 2.0.2 | 2.0.3 |
| `@istanbuljs/schema` | 0.1.3 | 0.1.6 |
| `@jridgewell/gen-mapping` | 0.3.5 | 0.3.13 |
| `@jridgewell/sourcemap-codec` | 1.4.15 | 1.5.5 |
| `@jridgewell/trace-mapping` | 0.3.25 | 0.3.31 |
| `@sinclair/typebox` | 0.27.8 | 0.27.10 |
| `@testing-library/jest-dom` | 6.4.2 | 6.9.1 |
| `@tootallnate/once` | 2.0.0 | 2.0.1 |
| `@types/babel__generator` | 7.6.8 | 7.27.0 |
| `@types/babel__traverse` | 7.20.5 | 7.28.0 |
| `@types/jest` | 29.5.12 | 29.5.14 |
| `@types/yargs` | 17.0.32 | 17.0.35 |
| `@typescript-eslint/eslint-plugin` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/parser` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/scope-manager` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/type-utils` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/types` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/typescript-estree` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/utils` | 7.13.0 | 7.18.0 |
| `@typescript-eslint/visitor-keys` | 7.13.0 | 7.18.0 |
| `ajv` | 6.12.6 | 6.15.0 |
| `array-buffer-byte-length` | 1.0.1 | 1.0.2 |
| `array-includes` | 3.1.7 | 3.1.9 |
| `array.prototype.findlastindex` | 1.2.4 | 1.2.6 |
| `array.prototype.flat` | 1.3.2 | 1.3.3 |
| `array.prototype.flatmap` | 1.3.2 | 1.3.3 |
| `arraybuffer.prototype.slice` | 1.0.3 | 1.0.4 |
| `babel-preset-current-node-syntax` | 1.0.1 | 1.2.0 |
| `brace-expansion` | 2.0.2 | 2.1.1 |
| `brace-expansion` | 1.1.12 | 1.1.15 |
| `browserslist` | 4.23.0 | 4.28.2 |
| `call-bind` | 1.0.7 | 1.0.9 |
| `caniuse-lite` | 1.0.30001677 | 1.0.30001793 |
| `collect-v8-coverage` | 1.0.2 | 1.0.3 |
| `decimal.js` | 10.4.3 | 10.6.0 |
| `dedent` | 1.5.3 | 1.7.2 |
| `electron-to-chromium` | 1.4.736 | 1.5.364 |
| `entities` | 4.5.0 | 6.0.1 |
| `error-ex` | 1.3.2 | 1.3.4 |
| `es-abstract` | 1.22.5 | 1.24.2 |
| `es-shim-unscopables` | 1.0.2 | 1.1.0 |
| `es-to-primitive` | 1.2.1 | 1.3.0 |
| `escalade` | 3.1.2 | 3.2.0 |
| `eslint` | 8.57.0 | 8.57.1 |
| `eslint-module-utils` | 2.8.1 | 2.13.0 |
| `eslint-plugin-import` | 2.29.1 | 2.32.0 |
| `flatted` | 3.3.1 | 3.4.2 |
| `for-each` | 0.3.3 | 0.3.5 |
| `function.prototype.name` | 1.1.6 | 1.1.8 |
| `get-symbol-description` | 1.0.2 | 1.1.0 |
| `globalthis` | 1.0.3 | 1.0.4 |
| `has-proto` | 1.0.3 | 1.2.0 |
| `hasown` | 2.0.2 | 2.0.4 |
| `import-local` | 3.1.0 | 3.2.0 |
| `internal-slot` | 1.0.7 | 1.1.0 |
| `is-array-buffer` | 3.0.4 | 3.0.5 |
| `is-async-function` | 2.0.0 | 2.1.1 |
| `is-bigint` | 1.0.4 | 1.1.0 |
| `is-boolean-object` | 1.1.2 | 1.2.2 |
| `is-core-module` | 2.13.1 | 2.16.2 |
| `is-date-object` | 1.0.5 | 1.1.0 |
| `is-finalizationregistry` | 1.0.2 | 1.1.1 |
| `is-generator-function` | 1.0.10 | 1.1.2 |
| `is-map` | 2.0.2 | 2.0.3 |
| `is-number-object` | 1.0.7 | 1.1.1 |
| `is-regex` | 1.1.4 | 1.2.1 |
| `is-set` | 2.0.2 | 2.0.3 |
| `is-shared-array-buffer` | 1.0.3 | 1.0.4 |
| `is-string` | 1.0.7 | 1.1.1 |
| `is-symbol` | 1.0.4 | 1.1.1 |
| `is-typed-array` | 1.1.13 | 1.1.15 |
| `is-weakmap` | 2.0.1 | 2.0.2 |
| `is-weakref` | 1.0.2 | 1.1.1 |
| `is-weakset` | 2.0.2 | 2.0.4 |
| `istanbul-lib-instrument` | 6.0.2 | 6.0.3 |
| `istanbul-reports` | 3.1.7 | 3.2.0 |
| `jsesc` | 2.5.2 | 3.1.0 |
| `lodash` | 4.17.21 | 4.18.1 |
| `minimatch` | 9.0.4 | 9.0.9 |
| `minimatch` | 9.0.5 | 9.0.9 |
| `minimatch` | 3.1.2 | 3.1.5 |
| `node-releases` | 2.0.14 | 2.0.46 |
| `nwsapi` | 2.2.7 | 2.2.23 |
| `object-inspect` | 1.13.1 | 1.13.4 |
| `object.assign` | 4.1.5 | 4.1.7 |
| `object.fromentries` | 2.0.7 | 2.0.8 |
| `object.groupby` | 1.0.2 | 1.0.3 |
| `object.values` | 1.1.7 | 1.2.1 |
| `parse5` | 7.1.2 | 7.3.0 |
| `picomatch` | 2.3.1 | 2.3.2 |
| `pirates` | 4.0.6 | 4.0.7 |
| `possible-typed-array-names` | 1.0.0 | 1.1.0 |
| `react-is` | 18.2.0 | 18.3.1 |
| `reflect.getprototypeof` | 1.0.5 | 1.0.10 |
| `regexp.prototype.flags` | 1.5.2 | 1.5.4 |
| `resolve.exports` | 2.0.2 | 2.0.3 |
| `safe-array-concat` | 1.1.0 | 1.1.4 |
| `safe-regex-test` | 1.0.3 | 1.1.0 |
| `set-function-length` | 1.2.1 | 1.2.2 |
| `side-channel` | 1.0.6 | 1.1.0 |
| `string.prototype.trim` | 1.2.8 | 1.2.10 |
| `string.prototype.trimend` | 1.0.7 | 1.0.9 |
| `string.prototype.trimstart` | 1.0.7 | 1.0.8 |
| `ts-jest` | 29.1.2 | 29.4.11 |
| `typed-array-buffer` | 1.0.2 | 1.0.3 |
| `typed-array-byte-length` | 1.0.1 | 1.0.3 |
| `typed-array-byte-offset` | 1.0.2 | 1.0.4 |
| `typed-array-length` | 1.0.5 | 1.0.8 |
| `typescript-eslint` | 7.13.0 | 7.18.0 |
| `unbox-primitive` | 1.0.2 | 1.1.0 |
| `undici` | 6.23.0 | 6.26.0 |
| `update-browserslist-db` | 1.0.13 | 1.2.3 |
| `v8-to-istanbul` | 9.2.0 | 9.3.0 |
| `which-boxed-primitive` | 1.0.2 | 1.1.1 |
| `which-builtin-type` | 1.1.3 | 1.2.1 |
| `which-collection` | 1.0.1 | 1.0.2 |
| `which-typed-array` | 1.1.14 | 1.1.21 |
| `ws` | 8.18.0 | 8.21.0 |

## Added (27)

| Package | Version |
|---|---|
| `@babel/helper-globals` | 7.29.7 |
| `@babel/plugin-syntax-class-static-block` | 7.14.5 |
| `@babel/plugin-syntax-import-attributes` | 7.29.7 |
| `@babel/plugin-syntax-private-property-in-object` | 7.14.5 |
| `@jridgewell/remapping` | 2.3.5 |
| `@rtsao/scc` | 1.1.0 |
| `async-function` | 1.0.0 |
| `baseline-browser-mapping` | 2.10.33 |
| `call-bound` | 1.0.4 |
| `data-view-buffer` | 1.0.2 |
| `data-view-byte-length` | 1.0.2 |
| `data-view-byte-offset` | 1.0.1 |
| `generator-function` | 2.0.1 |
| `handlebars` | 4.7.9 |
| `is-data-view` | 1.0.2 |
| `neo-async` | 2.6.2 |
| `own-keys` | 1.0.1 |
| `safe-push-apply` | 1.0.0 |
| `semver` | 7.8.1 |
| `set-proto` | 1.0.0 |
| `side-channel-list` | 1.0.1 |
| `side-channel-map` | 1.0.1 |
| `side-channel-weakmap` | 1.0.2 |
| `stop-iteration-iterator` | 1.1.0 |
| `type-fest` | 4.41.0 |
| `uglify-js` | 3.19.3 |
| `wordwrap` | 1.0.0 |

## Removed (11)

| Package | Version |
|---|---|
| `@ampproject/remapping` | 2.3.0 |
| `@babel/helper-environment-visitor` | 7.22.20 |
| `@babel/helper-function-name` | 7.23.0 |
| `@babel/helper-hoist-variables` | 7.22.5 |
| `@babel/helper-simple-access` | 7.22.5 |
| `@babel/helper-split-export-declaration` | 7.22.6 |
| `@jridgewell/set-array` | 1.2.1 |
| `array.prototype.filter` | 1.0.3 |
| `chalk` | 3.0.0 |
| `es-array-method-boxes-properly` | 1.0.0 |
| `globals` | 11.12.0 |

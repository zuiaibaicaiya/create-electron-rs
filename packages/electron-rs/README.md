# electron-rs
### electron project with rsbuild and web framework,etc vue or react
## Create your project
``` bash
npm create rsbuild@latest
# pnpm
# pnpm create rsbuild@latest

```
## Install the dependencies:

```bash
npm i bytenode

npm i electron-rs -D
npm i @rsbuild/plugin-node-polyfill -D
# or
# pnpm i bytenode
# pnpm i electron-rs -D
# pnpm i @rsbuild/plugin-node-polyfill -D

```
# Modify rsbuild.config.ts
## react+ts

``` typescript
// rsbuild.config.ts
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';

export default defineConfig({
  plugins: [pluginReact(), electronRs(), pluginNodePolyfill()]
});

```
If you need preload , modify electronRs config like this
``` typescript
electronRs({ preload: {} })
```

## vue3+ts

```typescript
// rsbuild.config.ts

import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';
export default defineConfig({
  plugins: [pluginVue(), electronRs(), pluginNodePolyfill()],
});


```

## Create main.ts and preload.ts in `electron` folder at project root
```bash
mkdir electron && cd electron
touch electron.ts && touch preload.ts
```
## Modify you package.json add the code
```json
{

  "main": "dist/electron/main.cjs",
  "build": {
    "directories": {
      "output": "build-electron"
    },
    "extraResources": [],
    "files": [
      "dist"
    ]
  }
}

```

If you need obfuscator , modify electronRs config like this . It's only effective in the production mode.

```typescript

electronRs({
  obfuscator: {
    options: {
      rotateStringArray: true,
      stringArray: true,
      stringArrayThreshold: 0.75,
    },
    excludes: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.d.ts',
      '**/node_modules/**',
      // '**/vendor.js' // 排除第三方库
    ],
  },
}),

```

## Start your project
```bash
npm run dev
# or
# pnpm run dev
```
## Build your project
```bash
npm run build
# or
# pnpm run build
```

## You can also create a new project with `create-electron-rs`
```bash
npm create electron-rs@latest
# or pnpm
# pnpm create electron-rs@latest
```

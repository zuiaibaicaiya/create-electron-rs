# create-electron-rs project

## Setup

Install the dependencies:

```bash
npm install
```

## Get started

Start the dev server:

```bash
npm run dev
```

Build the app for production:

```bash
npm run build
```

If you need preload , modify electronRs config like this
``` typescript
electronRs({ preload: {} })
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

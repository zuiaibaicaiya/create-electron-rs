import { defineConfig } from '@rslib/core';

export default defineConfig({
  tools: {
    rspack: {
      externals: ['electron', 'bytenode', '@rsbuild/core']
    }
  },
  output: { minify: true },
  lib: [
    {
      format: 'esm',
      syntax: ['node 18'],
      dts: true
    },
    {
      format: 'cjs',
      syntax: ['node 18']
    }
  ]
});

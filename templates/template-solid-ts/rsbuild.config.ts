import { defineConfig } from '@rsbuild/core';
import { pluginBabel } from '@rsbuild/plugin-babel';
import { pluginSolid } from '@rsbuild/plugin-solid';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';

export default defineConfig({
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
    electronRs(),
    pluginNodePolyfill()
  ],
});

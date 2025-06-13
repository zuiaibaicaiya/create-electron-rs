import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';

export default defineConfig({
  plugins: [pluginReact(), electronRs(), pluginNodePolyfill()]
});

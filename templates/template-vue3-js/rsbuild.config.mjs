import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill';
import { electronRs } from 'electron-rs';
export default defineConfig({
  plugins: [pluginVue(), electronRs(), pluginNodePolyfill()],
});

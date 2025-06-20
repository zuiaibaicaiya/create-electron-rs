import type {
  RsbuildConfig,
  RsbuildPlugin,
  EnvironmentConfig,
} from '@rsbuild/core';
import { createRsbuild, mergeRsbuildConfig } from '@rsbuild/core';
import electron from 'electron';
import { spawn } from 'child_process';
import * as path from 'node:path';
import { resolve } from 'path';
import * as fs from 'node:fs';
import * as bytenode from 'bytenode';

const isDev = process.env.NODE_ENV === 'development';

interface electronRsConfig {
  main: EnvironmentConfig;
  preload?: EnvironmentConfig | boolean;
}

export const electronRs = (
  config: electronRsConfig = { main: {} },
): RsbuildPlugin => ({
  name: 'electronRs',
  async setup(api) {
    api.modifyRsbuildConfig((userConfig, { mergeRsbuildConfig }) => {
      const extraConfig: RsbuildConfig = {
        output: {
          assetPrefix: './',
          externals: {
            fs: 'commonjs2 fs',
            path: 'commonjs2 path',
            os: 'commonjs2 os',
            process: 'commonjs2 process',
            electron: 'commonjs2 electron',
          },
        },
        html: {
          title: 'electronRs',
        },
      };
      return mergeRsbuildConfig(userConfig, extraConfig);
    });
    const main: EnvironmentConfig = {
      performance: {
        printFileSize: !isDev,
      },
      source: {
        entry: {
          main: fs.existsSync(path.join(process.cwd(), './electron/main.ts'))
            ? path.join(process.cwd(), './electron/main.ts')
            : path.join(process.cwd(), './electron/main.js'),
        },
      },
      output: {
        distPath: {
          js: '',
          root: 'dist/electron',
        },
        filename: {
          js: '[name].cjs',
        },
        sourceMap: false,
      },
      tools: {
        htmlPlugin: false,
        rspack: {
          name: 'electron-rs-main',
          target: 'electron-main',
        },
      },
    };
    const preload: EnvironmentConfig = {
      performance: {
        printFileSize: !isDev,
      },
      source: {
        entry: {
          preload: fs.existsSync(
            path.join(process.cwd(), './electron/preload.ts'),
          )
            ? path.join(process.cwd(), './electron/preload.ts')
            : path.join(process.cwd(), './electron/preload.js'),
        },
      },
      output: {
        distPath: {
          js: '',
          root: 'dist/electron',
        },
        filename: {
          js: '[name].cjs',
        },
        sourceMap: false,
      },
      tools: {
        htmlPlugin: false,
        rspack: {
          name: 'electron-rs-preload',
          target: 'electron-preload',
        },
      },
    };

    const environments: Record<string, EnvironmentConfig> = {
      main: mergeRsbuildConfig(main, config.main),
    };
    if (config.preload) {
      if (typeof config.preload === 'object') {
        main.tools = {
          htmlPlugin: false,
          rspack: {
            dependencies: ['electron-rs-preload'],
            name: 'electron-rs-main',
            target: 'electron-main',
          },
        };
        environments['preload'] = mergeRsbuildConfig(preload, config.preload);
      } else {
        main.tools = {
          htmlPlugin: false,
          rspack: {
            dependencies: ['electron-rs-preload'],
            name: 'electron-rs-main',
            target: 'electron-main',
          },
        };
        environments['preload'] = preload;
      }
    }
    const rsbuild = createRsbuild({
      rsbuildConfig: {
        environments: environments,
      },
    });
    api.onBeforeStartDevServer(async () => {
      await (await rsbuild).build();
    });
    api.onAfterStartDevServer(async (options) => {
      const address = `http://localhost:${options.port}`;
      // console.log(address)
      const electronProcess = spawn(
        electron.toString(),
        ['./dist/electron/main.cjs', address],
        {
          cwd: process.cwd(),
          stdio: 'inherit',
          env: {
            ...process.env,
            ELECTRON_RENDERER_URL: address,
          },
        },
      );
      electronProcess.on('close', () => {
        electronProcess.kill();
        process.exit();
      });
    });

    api.onAfterBuild(async () => {
      await (await rsbuild).build();
      // 加密主进程
      await bytenode.compileFile({
        electron: true,
        filename: resolve(process.cwd(), 'dist', 'electron', 'main.cjs'),
      });
      fs.writeFileSync(
        resolve(process.cwd(), 'dist', 'electron', 'main.cjs'),
        "require('bytenode');module.exports = require('./main.jsc')",
      );
      if (
        fs.existsSync(resolve(process.cwd(), 'dist', 'electron', 'preload.cjs'))
      ) {
        // 加密preload
        await bytenode.compileFile({
          electron: true,
          filename: resolve(process.cwd(), 'dist', 'electron', 'preload.cjs'),
        });
        fs.writeFileSync(
          resolve(process.cwd(), 'dist', 'electron', 'preload.cjs'),
          "require('bytenode');module.exports = require('./preload.jsc')",
        );
      }

      spawn('electron-builder', {
        stdio: 'inherit',
        shell: true,
      });
    });
  },
});

import {
  app,
  BrowserWindow,
  type BrowserWindowConstructorOptions
} from 'electron';
import { join } from 'node:path';

app.commandLine.appendSwitch('remote-allow-origins', '*');
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

let mainWindow: BrowserWindow;
const createWindow = async () => {
  const config: BrowserWindowConstructorOptions = {
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.cjs')
    }
  };
  mainWindow = new BrowserWindow(config);
  if (process.env['ELECTRON_RENDERER_URL']) {
    await mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']).then(() => {
      mainWindow.webContents.openDevTools({ mode: 'bottom' });
    });
  } else {
    await mainWindow.loadFile(app.getAppPath() + '/dist/index.html');
  }
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 用户正在尝试运行第二个实例，我们需要让焦点指向我们的窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      if (!mainWindow.isVisible()) {
        mainWindow.show();
      }
      mainWindow.focus();
    }
  });
  app.whenReady().then(async () => {
    await createWindow();
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      app.exit();
    }
  });
  app.on('quit', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    } else {
      app.exit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });
}

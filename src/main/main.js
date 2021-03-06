const { app, protocol, screen, BrowserWindow } = require('electron')
const { initIpcListeners } = require('./ipcMain/listener')
import installExtension, { REDUX_DEVTOOLS,REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } },
])

let win

function createWindow() {
  // 创建浏览器窗口
  let display = screen.getPrimaryDisplay()

  win = new BrowserWindow({
    // width: Math.round(display.size.width / 3.3),
    // height: Math.round(display.size.height / 2.5),
    // x: Math.round(display.size.width / 1.55),
    // y: Math.round(display.size.height / 25),
    // frame: false,
    resizable: true,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
    },
  })

  // 并且为你的应用加载index.html
  win.loadURL('http://localhost:8080/')

  // 打开开发者工具
  win.webContents.openDevTools()
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));
  installExtension(REACT_DEVELOPER_TOOLS)
  .then((name) => console.log(`Added Extension:  ${name}`))
  .catch((err) => console.log('An error occurred: ', err));
  initIpcListeners(), createWindow()

})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 您可以把应用程序其他的流程写在在此文件中
// 代码 也可以拆分成几个文件，然后用 require 导入。

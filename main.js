// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { spawn } = require('child_process');
const path = require('path')

function startBackend() {
  const backendPath = path.resolve(__dirname, '../projekt1_node/node_app/app.js');

  const backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
    shell: true
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`)
  });
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    autoHideMenuBar: false // true to hide, press Alt to show when hidden
  })

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'frontend', 'index.html'));

  // Open DevTools automatically (comment out if you don't want it)
  mainWindow.webContents.openDevTools()
}

// Called when Electron is ready to create browser windows.
app.whenReady().then(() => {
  startBackend();
  createWindow()
})

// Example functions for communication between main and renderer (backend/frontend)
ipcMain.handle('get-stuff-from-main', () => 'Stuff from main!')
ipcMain.handle('send-stuff-to-main', async (event, data) => console.log(data))

app.on('window-all-closed', function () {
  app.quit()
})
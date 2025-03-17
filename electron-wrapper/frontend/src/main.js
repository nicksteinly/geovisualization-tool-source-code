const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
let mainWindow;

// Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      webviewTag: true, // allows maps loaded from wep to be shown
      nodeIntegration: false, // Security measure: Disable nodeIntegration in the renderer process
      contextIsolation: true, // Isolate context for security
    }
  });

  // Load the static React build (index.html)
  mainWindow.loadFile(path.join(__dirname, '../build', 'index.html'));

  // Load Dynamic React App, need to execute 'npm run start-react' in the Command Prompt to start React app on a local port
  // mainWindow.loadURL('http://localhost:3000');

  // mainWindow.webContents.openDevTools(); // Open DevTools in development

  // Set up the window to close gracefully
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Electron app initialization
app.whenReady().then(() => {
  createWindow();

  // needs to be here

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

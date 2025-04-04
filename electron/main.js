
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../public/favicon.ico')
  });

  // Load the index.html from the app or the dev server
  mainWindow.loadURL(
    isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../dist/index.html')}`
  );

  // Open DevTools automatically in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    // No menu in production
    mainWindow.setMenu(null);
  }

  // When window is closed, set mainWindow to null
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle IPC messages from the renderer process
ipcMain.handle('get-wifi-networks', async () => {
  // In a real app, this would use the native Node.js WiFi API
  // For now, this is just a mock
  return { success: true, message: 'This would return actual WiFi networks in a real implementation' };
});

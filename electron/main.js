
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const wifi = require('node-wifi'); // This would need to be installed
const keytar = require('keytar'); // Secure credential storage

let mainWindow;

// Initialize WiFi module
wifi.init({
  iface: null // Use the first available WiFi interface
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: false, // Security: Keep this false
      contextIsolation: true, // Security: Keep this true
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

// Application service name for keytar
const SERVICE_NAME = 'WiFiWhisperer';

// Handle IPC messages from the renderer process
ipcMain.handle('get-wifi-networks', async () => {
  try {
    const networks = await wifi.scan();
    return { success: true, networks };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('connect-to-network', async (event, ssid, password) => {
  try {
    await wifi.connect({ ssid, password });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('disconnect-from-network', async (event, ssid) => {
  try {
    await wifi.disconnect();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Secure password storage using the system's credential manager
ipcMain.handle('store-password', async (event, ssid, password) => {
  try {
    await keytar.setPassword(SERVICE_NAME, ssid, password);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-password', async (event, ssid) => {
  try {
    const password = await keytar.getPassword(SERVICE_NAME, ssid);
    return { success: true, password };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-all-passwords', async () => {
  try {
    const credentials = await keytar.findCredentials(SERVICE_NAME);
    const passwords = credentials.map(cred => ({
      ssid: cred.account,
      password: cred.password,
      lastUsed: new Date().toISOString() // Note: This is a limitation, we don't store last used date
    }));
    return { success: true, passwords };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-password', async (event, ssid) => {
  try {
    await keytar.deletePassword(SERVICE_NAME, ssid);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

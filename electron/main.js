
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
const wifi = require('node-wifi'); // This would need to be installed
const keytar = require('keytar'); // Secure credential storage
const os = require('os'); // For detecting number of CPU cores

let mainWindow;

// Configure process to use all available CPU cores
process.env.UV_THREADPOOL_SIZE = os.cpus().length;

// Initialize WiFi module with enhanced driver support
wifi.init({
  iface: null, // Use the first available WiFi interface
  driverTimeout: 10000, // Increase timeout for driver initialization
  scanTimeout: 5000 // Scan timeout
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: false, // Security: Keep this false
      contextIsolation: true, // Security: Keep this true
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev // Only show dev tools in development mode
    },
    icon: path.join(__dirname, '../public/favicon.ico'),
    show: false, // Don't show until ready
    backgroundColor: '#ffffff'
  });

  // Load the index.html from the app or the dev server
  const url = isDev 
    ? 'http://localhost:8080' 
    : `file://${path.join(__dirname, '../dist/index.html')}`;
    
  mainWindow.loadURL(url);

  // Show window when ready to reduce visual flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

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

app.whenReady().then(() => {
  createWindow();
  
  // Check and install any missing drivers if needed
  checkDriverSupport();
});

// Function to verify driver support
function checkDriverSupport() {
  const platform = process.platform;
  console.log(`Checking driver support for ${platform}...`);
  
  // Platform specific driver checks would go here
  // In a real app, this would check for and install needed drivers
}

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

// Get real network information
async function getCurrentConnection() {
  try {
    const currentConnections = await wifi.getCurrentConnections();
    return currentConnections.length > 0 ? currentConnections[0] : null;
  } catch (error) {
    console.error('Error getting current connection:', error);
    return null;
  }
}

// Handle IPC messages from the renderer process
ipcMain.handle('get-wifi-networks', async () => {
  try {
    const networks = await wifi.scan();
    
    // Get current connection to mark as connected
    const currentConnection = await getCurrentConnection();
    
    // Format network data for frontend
    const formattedNetworks = networks.map(network => ({
      ssid: network.ssid,
      signalStrength: Math.min(100, Math.max(0, network.signal_level + 100)), // Convert to 0-100 scale
      secured: network.security !== '' && network.security !== 'none',
      connected: currentConnection && currentConnection.ssid === network.ssid,
      favorite: false, // Will be updated later
      bssid: network.bssid,
      security: network.security,
      channel: network.channel
    }));
    
    // Get saved networks to mark favorites
    try {
      const credentials = await keytar.findCredentials(SERVICE_NAME);
      const savedSsids = credentials.map(cred => cred.account);
      
      formattedNetworks.forEach(network => {
        network.favorite = savedSsids.includes(network.ssid);
      });
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
    
    return { success: true, networks: formattedNetworks };
  } catch (error) {
    console.error('Error scanning networks:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('connect-to-network', async (event, ssid, password) => {
  try {
    console.log(`Connecting to ${ssid}...`);
    await wifi.connect({ ssid, password });
    console.log(`Connected to ${ssid}`);
    return { success: true };
  } catch (error) {
    console.error(`Error connecting to ${ssid}:`, error);
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

ipcMain.handle('get-current-network', async () => {
  try {
    const currentConnection = await getCurrentConnection();
    return { success: true, network: currentConnection };
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

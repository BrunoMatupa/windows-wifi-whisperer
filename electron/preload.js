
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    getWifiNetworks: () => ipcRenderer.invoke('get-wifi-networks'),
    connectToNetwork: (ssid, password) => ipcRenderer.invoke('connect-to-network', ssid, password),
    disconnectFromNetwork: (ssid) => ipcRenderer.invoke('disconnect-from-network', ssid),
    storePassword: (ssid, password) => ipcRenderer.invoke('store-password', ssid, password),
    getPassword: (ssid) => ipcRenderer.invoke('get-password', ssid),
    getAllPasswords: () => ipcRenderer.invoke('get-all-passwords'),
    deletePassword: (ssid) => ipcRenderer.invoke('delete-password', ssid)
  }
);

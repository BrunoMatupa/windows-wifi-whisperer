
// Secure storage utility for WiFi passwords
// Uses Electron's keytar in desktop app, falls back to localStorage for web demo

// Check if we're running in Electron
const isElectron = (): boolean => {
  try {
    return window.api && window.api.isElectron();
  } catch (e) {
    return false;
  }
};

// Simple encryption for web demo only (NOT FOR PRODUCTION)
const encrypt = (text: string, key: string): string => {
  return btoa(text);
};

const decrypt = (encryptedText: string, key: string): string => {
  try {
    return atob(encryptedText);
  } catch {
    return "";
  }
};

// User's secret key (in a real app, this would be derived from user credentials)
const getSecretKey = (): string => {
  const savedKey = localStorage.getItem('user_secret_key');
  if (savedKey) return savedKey;
  
  // Generate a new key if none exists
  const newKey = Math.random().toString(36).substring(2, 15);
  localStorage.setItem('user_secret_key', newKey);
  return newKey;
};

interface StoredPassword {
  ssid: string;
  password: string;
  lastUsed: string;
}

export const secureStorage = {
  savePassword: async (ssid: string, password: string): Promise<void> => {
    try {
      if (isElectron()) {
        // Use Electron's secure storage
        await window.api.storePassword(ssid, password);
      } else {
        // Fallback for web demo
        const key = getSecretKey();
        const storedPasswords = await secureStorage.getAllPasswords();
        
        const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
        updatedPasswords.push({
          ssid,
          password: encrypt(password, key),
          lastUsed: new Date().toISOString()
        });
        
        localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
      }
    } catch (error) {
      console.error("Error saving password:", error);
    }
  },
  
  getPassword: async (ssid: string): Promise<string | null> => {
    try {
      if (isElectron()) {
        // Use Promise with Electron API
        const result = await window.api.getPassword(ssid);
        return result.success ? result.password : null;
      }
      
      // Fallback for web demo
      const storedPasswords = await secureStorage.getAllPasswords();
      const networkPassword = storedPasswords.find(p => p.ssid === ssid);
      
      if (networkPassword) {
        const key = getSecretKey();
        return decrypt(networkPassword.password, key);
      }
      return null;
    } catch (error) {
      console.error("Error getting password:", error);
      return null;
    }
  },
  
  getAllPasswords: async (): Promise<StoredPassword[]> => {
    try {
      if (isElectron()) {
        // Use Promise with Electron API
        const result = await window.api.getAllPasswords();
        return result.success ? result.passwords : [];
      }
      
      // Fallback for web demo
      const key = getSecretKey();
      const storedData = localStorage.getItem('wifi_passwords');
      
      if (!storedData) return [];
      
      const decrypted = decrypt(storedData, key);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error("Error getting all passwords:", error);
      return [];
    }
  },
  
  deletePassword: async (ssid: string): Promise<void> => {
    try {
      if (isElectron()) {
        // Use Electron's secure storage
        await window.api.deletePassword(ssid);
        return;
      }
      
      // Fallback for web demo
      const key = getSecretKey();
      const storedPasswords = await secureStorage.getAllPasswords();
      const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
      
      localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  }
};

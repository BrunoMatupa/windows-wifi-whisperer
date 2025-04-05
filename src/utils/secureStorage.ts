
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
  savePassword: (ssid: string, password: string): void => {
    try {
      if (isElectron()) {
        // Use Electron's secure storage
        window.api.storePassword(ssid, password);
      } else {
        // Fallback for web demo
        const key = getSecretKey();
        const storedPasswords = secureStorage.getAllPasswords();
        
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
  
  getPassword: (ssid: string): string | null => {
    try {
      if (isElectron()) {
        // Use async/await with Promise conversion for Electron API
        return window.api.getPassword(ssid)
          .then((result: any) => result.success ? result.password : null)
          .catch(() => null);
      }
      
      // Fallback for web demo
      const storedPasswords = secureStorage.getAllPasswords();
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
  
  getAllPasswords: (): StoredPassword[] => {
    try {
      if (isElectron()) {
        // Use async/await with Promise conversion for Electron API
        return window.api.getAllPasswords()
          .then((result: any) => result.success ? result.passwords : [])
          .catch(() => []);
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
  
  deletePassword: (ssid: string): void => {
    try {
      if (isElectron()) {
        // Use Electron's secure storage
        window.api.deletePassword(ssid);
        return;
      }
      
      // Fallback for web demo
      const key = getSecretKey();
      const storedPasswords = secureStorage.getAllPasswords();
      const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
      
      localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  }
};

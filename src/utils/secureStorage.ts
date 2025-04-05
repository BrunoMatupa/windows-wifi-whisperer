
// This is an improved implementation of secure storage
// In a real desktop app, it would use the Electron secure store or Windows Credential Manager

// Simple encryption (NOT FOR PRODUCTION USE)
const encrypt = (text: string, key: string): string => {
  // This is just a simple mock encryption for demo purposes
  const encodedText = btoa(text);
  return encodedText;
};

const decrypt = (encryptedText: string, key: string): string => {
  // This is just a simple mock decryption for demo purposes
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

// Check if we're running in Electron
const isElectron = (): boolean => {
  // Fixed the TypeScript error by checking for window.process existence first
  return typeof window !== 'undefined' && 
         typeof window.process !== 'undefined' && 
         !!window.process && 
         !!window.process.versions && 
         !!window.process.versions.electron;
};

interface StoredPassword {
  ssid: string;
  password: string;
  lastUsed: string;
}

export const secureStorage = {
  savePassword: (ssid: string, password: string): void => {
    try {
      // In Electron, this would use a more secure method
      const key = getSecretKey();
      const storedPasswords = secureStorage.getAllPasswords();
      
      const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
      updatedPasswords.push({
        ssid,
        password: encrypt(password, key),
        lastUsed: new Date().toISOString()
      });
      
      localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
      
      if (isElectron()) {
        console.log('In Electron, we would use the native secure storage instead of localStorage');
        // In a real implementation we would use:
        // window.api.storePassword(ssid, password);
      }
    } catch (error) {
      console.error("Error saving password:", error);
    }
  },
  
  getPassword: (ssid: string): string | null => {
    try {
      if (isElectron()) {
        // This would be replaced with actual Electron IPC call
        console.log('In Electron, we would retrieve from secure store instead');
        // return window.api.getPassword(ssid);
      }
      
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
        // This would be replaced with actual Electron IPC call
        console.log('In Electron, we would retrieve from secure store instead');
        // return window.api.getAllPasswords();
      }
      
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
        // This would be replaced with actual Electron IPC call
        console.log('In Electron, we would delete from secure store instead');
        // window.api.deletePassword(ssid);
        // return;
      }
      
      const key = getSecretKey();
      const storedPasswords = secureStorage.getAllPasswords();
      const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
      
      localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  }
};

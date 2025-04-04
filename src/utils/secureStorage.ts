
// This is a mock implementation of secure storage
// In a real application, this would use the Windows Credential Manager or similar

// Simple encryption mock (NOT FOR PRODUCTION USE)
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

interface StoredPassword {
  ssid: string;
  password: string;
  lastUsed: string;
}

export const secureStorage = {
  savePassword: (ssid: string, password: string): void => {
    try {
      const key = getSecretKey();
      const storedPasswords = secureStorage.getAllPasswords();
      
      const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
      updatedPasswords.push({
        ssid,
        password: encrypt(password, key),
        lastUsed: new Date().toISOString()
      });
      
      localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
    } catch (error) {
      console.error("Error saving password:", error);
    }
  },
  
  getPassword: (ssid: string): string | null => {
    try {
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
      const key = getSecretKey();
      const storedPasswords = secureStorage.getAllPasswords();
      const updatedPasswords = storedPasswords.filter(p => p.ssid !== ssid);
      
      localStorage.setItem('wifi_passwords', encrypt(JSON.stringify(updatedPasswords), key));
    } catch (error) {
      console.error("Error deleting password:", error);
    }
  }
};

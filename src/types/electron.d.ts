
export {};

declare global {
  interface Window {
    api: {
      getWifiNetworks: () => Promise<{success: boolean, networks: any[], error?: string}>;
      connectToNetwork: (ssid: string, password: string | null) => Promise<{success: boolean, error?: string}>;
      disconnectFromNetwork: (ssid: string) => Promise<{success: boolean, error?: string}>;
      storePassword: (ssid: string, password: string) => Promise<{success: boolean, error?: string}>;
      getPassword: (ssid: string) => Promise<{success: boolean, password?: string, error?: string}>;
      getAllPasswords: () => Promise<{success: boolean, passwords: {ssid: string, password: string}[], error?: string}>;
      deletePassword: (ssid: string) => Promise<{success: boolean, error?: string}>;
      getCurrentNetwork: () => Promise<{success: boolean, network?: any, error?: string}>;
      isElectron: () => boolean;
    }
  }
}

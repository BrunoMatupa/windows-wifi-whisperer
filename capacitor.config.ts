
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.00024f68422345d08094878b30279412',
  appName: 'WiFi Whisperer Pro',
  webDir: 'dist',
  server: {
    url: 'https://00024f68-4223-45d0-8094-878b30279412.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: 'wifi-whisperer.keystore',
      keystoreAlias: 'wifi-whisperer',
      keystorePassword: 'wifi-whisperer',
      releaseType: 'APK'
    }
  }
};

export default config;

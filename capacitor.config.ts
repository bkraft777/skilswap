
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.08c39ff6026749acb516e9e3e45814a5',
  appName: 'skilswap',
  webDir: 'dist',
  server: {
    url: 'https://08c39ff6-0267-49ac-b516-e9e3e45814a5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
  },
  android: {
    useLegacyBridge: false
  }
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.axiscreatorhub.app',
  appName: 'AXIS Creator Hub',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: 'https://ais-pre-bon6s4azhisktqi6demi6l-8331608079.europe-west2.run.app', // Using the Shared App URL from context
    cleartext: true
  }
};

export default config;

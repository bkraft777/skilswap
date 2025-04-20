
import { Capacitor } from '@capacitor/core';

/**
 * Checks if the app is running in a native environment
 */
export const isNative = () => {
  return Capacitor.isNativePlatform();
};

/**
 * Gets the platform the app is running on
 * @returns 'ios' | 'android' | 'web'
 */
export const getPlatform = () => {
  return Capacitor.getPlatform();
};

/**
 * Helper to check if the app is running on iOS
 */
export const isIOS = () => {
  return getPlatform() === 'ios';
};

/**
 * Helper to check if the app is running on Android
 */
export const isAndroid = () => {
  return getPlatform() === 'android';
};

/**
 * Initializes capacitor plugins and configurations
 */
export const initializeCapacitor = () => {
  // This function can be expanded later to initialize specific plugins
  console.log('Capacitor initialized on platform:', getPlatform());
};


import { Capacitor } from '@capacitor/core';

/**
 * Checks if the app is running in a native environment
 */
export const isNative = () => {
  try {
    return Capacitor.isNativePlatform();
  } catch (error) {
    console.error('Error checking native platform:', error);
    return false;
  }
};

/**
 * Gets the platform the app is running on
 * @returns 'ios' | 'android' | 'web'
 */
export const getPlatform = () => {
  try {
    return Capacitor.getPlatform();
  } catch (error) {
    console.error('Error getting platform:', error);
    return 'web';
  }
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
  try {
    // This function can be expanded later to initialize specific plugins
    console.log('Capacitor initialized on platform:', getPlatform());
    
    // Set up any platform-specific configurations
    if (isIOS()) {
      // iOS-specific initializations
    } else if (isAndroid()) {
      // Android-specific initializations
    }
  } catch (error) {
    console.error('Failed to initialize Capacitor:', error);
  }
};

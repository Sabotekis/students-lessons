import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PermissionsAndroid, Platform } from 'react-native';

const FOREGROUND_SERVICE_LOCATION =
  PermissionsAndroid.PERMISSIONS.FOREGROUND_SERVICE_LOCATION ||
  'android.permission.FOREGROUND_SERVICE_LOCATION';

export async function requestLocationPermissions() {
  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      ...(Platform.Version >= 29 ? [PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] : []),
      ...(Platform.Version >= 34 ? [FOREGROUND_SERVICE_LOCATION] : []),
    ].filter(Boolean);
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const fineGranted = granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
    const backgroundGranted = Platform.Version < 29 || granted[PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
    const fgsLocationGranted = Platform.Version < 34 || granted[FOREGROUND_SERVICE_LOCATION] === PermissionsAndroid.RESULTS.GRANTED;
    return fineGranted && backgroundGranted && fgsLocationGranted;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Notification permission denied");
    }
  }
}

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
    requestLocationPermissions();
  }, []);

  return <AppNavigator />;
}
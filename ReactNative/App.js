import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PermissionsAndroid, Platform } from 'react-native';

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
  }, []);

  return <AppNavigator />;
}
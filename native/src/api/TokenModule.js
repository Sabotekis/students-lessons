import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { TokenModule } = NativeModules;

export async function setTokenForNative() {
  const token = await AsyncStorage.getItem('accessToken');
  if (TokenModule && token) {
    TokenModule.setToken(token);
  }
}
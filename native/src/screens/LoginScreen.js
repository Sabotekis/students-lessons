import React, { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, Text } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.200.173:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#888',
          borderRadius: 6,
          padding: 14,
          marginBottom: 8,
          color: 'black',
          backgroundColor: '#fff',
        }}
        placeholderTextColor="#888" 
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#888',
          borderRadius: 6,
          padding: 14,
          marginBottom: 8,
          color: 'black', 
          backgroundColor: '#fff', 
        }}
        placeholderTextColor="#888" 
      />
      <TouchableOpacity
        style={{ backgroundColor: '#007bff', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 4 }}
        onPress={handleLogin}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
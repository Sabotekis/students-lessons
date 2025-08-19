import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getLoggedInUser, logoutUser } from '../api/authApi';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = await getLoggedInUser();
      setUser(loggedUser);
    };
    const unsubscribe = navigation.addListener('focus', fetchUser);
    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      navigation.navigate('Login');
    }
  };

  return (
    <View style={{ padding: 16 }}>
      {user ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ fontSize: 24 }}>Welcome, {user.username || user.name}!</Text>
            <TouchableOpacity
              onPress={handleLogout}
              style={{ marginLeft: 'auto', backgroundColor: 'red', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 4 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#007bff', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 4 }}
              onPress={() => navigation.navigate('Users')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Users</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 4 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#007bff', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 4 }}
              onPress={() => navigation.navigate('Sessions')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sessions</Text>
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 4 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#007bff', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 4 }}
              onPress={() => navigation.navigate('NFC Scan')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Scan</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={{ marginBottom: 4 }}>
            <TouchableOpacity
              style={{ backgroundColor: '#4CAF50', paddingVertical: 10, borderRadius: 6, alignItems: 'center', marginBottom: 4 }}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}
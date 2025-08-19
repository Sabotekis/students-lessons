import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanningUserId, setScanningUserId] = useState(null); 
  const [cancellingScan, setCancellingScan] = useState(false);

  useEffect(() => {
    fetch('http://192.168.200.124:5000/api/users', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleScanTag = async (userId) => {
    setScanningUserId(userId);
    try {
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.NfcA);
      const tag = await NfcManager.getTag();
      console.log('Scanned tag:', tag);

      const tagId = tag.id;

      const response = await fetch(`http://192.168.200.124:5000/api/users/${userId}/tag`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId }),
        credentials: 'include'
      });

      if (response.ok) {
        Alert.alert('Success', 'Tag assigned to user!');
      } else {
        Alert.alert('Error', 'Failed to assign tag.');
      }
    } catch (error) {
      if (error?.message && !error.message.includes("cancelled")) {
        Alert.alert('NFC Error', error.message);
      }
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (e) {
        console.log("Cancel request ignored:", e);
      }
      setScanningUserId(null);
    }
  };

  const handleCancelScan = async () => {
    setCancellingScan(true);
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (e) {
      console.log("Cancel request ignored:", e);
    }
    setScanningUserId(null);
    setCancellingScan(false);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ padding: 16 }}>
      <FlatList
        data={users}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={{
            marginBottom: 12,
            padding: 12,
            backgroundColor: '#eee',
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#5e6061ff'
          }}>
            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
            <Text>{item.email}</Text>
            <TouchableOpacity
              style={{
                marginTop: 8,
                backgroundColor: scanningUserId ? '#aaa' : '#007bff',
                paddingVertical: 10,
                borderRadius: 6,
                alignItems: 'center'
              }}
              onPress={() => handleScanTag(item._id)}
              disabled={!!scanningUserId}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {scanningUserId === item._id ? "Scanning..." : "Scan a Tag"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {scanningUserId && (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: 'black', marginBottom: 8 }}>
            Scanning mode active for user: {users.find(u => u._id === scanningUserId)?.username}
          </Text>
          {cancellingScan ? (
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Cancelling scanning...</Text>
          ) : (
            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                paddingVertical: 10,
                borderRadius: 6,
                alignItems: 'center',
                width: 120
              }}
              onPress={handleCancelScan}
              disabled={cancellingScan}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
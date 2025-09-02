import React, { useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert, TouchableOpacity } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

export default function ScanScreen() {
  const [scanning, setScanning] = useState(false);
  const [cancellingScan, setCancellingScan] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleScanTag = async () => {
    setScanning(true);
    setCardId(null);
    setUsers([]);
    try {
      await NfcManager.start();
      await NfcManager.requestTechnology(NfcTech.NfcA);
      const tag = await NfcManager.getTag();
      const tagId = tag.id;
      setCardId(tagId);

      setLoadingUsers(true);
      const response = await fetch(`http://192.168.200.173:5000/api/users/by-tag/${tagId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        Alert.alert('Error', 'Failed to fetch users for this card.');
      }
    } catch (error) {
      if (error?.message && !error.message.includes("cancelled")) {
        Alert.alert('NFC Error', error.message);
      }
    } finally {
      try {
        await NfcManager.cancelTechnologyRequest();
      } catch (e) {}
      setScanning(false);
      setLoadingUsers(false);
    }
  };

  const handleCancelScan = async () => {
    setCancellingScan(true);
    try {
      await NfcManager.cancelTechnologyRequest();
    } catch (e) {
      console.log("Cancel request ignored:", e);
    }
    setScanning(false);
    setCancellingScan(false);
  };

  const handleRemoveTagFromUser = async (userId) => {
    try {
      const response = await fetch(`http://192.168.200.173:5000/api/users/${userId}/tag`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagId: null }),
        credentials: 'include'
      });
      if (response.ok) {
        setUsers(users.filter(u => u._id !== userId));
        Alert.alert('Success', 'Tag removed from user!');
      } else {
        Alert.alert('Error', 'Failed to remove tag from user.');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TouchableOpacity
        style={{
          backgroundColor: scanning ? '#aaa' : '#007bff',
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 12,
        }}
        onPress={handleScanTag}
        disabled={scanning}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          {scanning ? "Scanning..." : "Scan a Card"}
        </Text>
      </TouchableOpacity>
      {scanning && (
        <TouchableOpacity
          style={{
            backgroundColor: 'red',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
            marginBottom: 12,
          }}
          onPress={handleCancelScan}
          disabled={cancellingScan}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      )}
      {cancellingScan && (
        <View style={{ marginTop: 8, alignItems: 'center' }}>
          <Text style={{ color: 'red' }}>Cancelling scanning...</Text>
        </View>
      )}
      {cardId && (
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Card Number: {cardId}</Text>
          <Text style={{ marginTop: 12, fontSize: 16 }}>Connected Users:</Text>
          {loadingUsers ? (
            <ActivityIndicator />
          ) : users.length === 0 ? (
            <Text style={{ color: 'red', marginTop: 12 }}>No users are connected to this card.</Text>
          ) : (
            <FlatList
              data={users}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={{
                  marginBottom: 8,
                  padding: 8,
                  backgroundColor: '#eee',
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: '#5e6061ff'
                }}>
                  <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
                  <Text>{item.email}</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'red',
                      paddingVertical: 8,
                      borderRadius: 6,
                      alignItems: 'center',
                      marginTop: 8,
                    }}
                    onPress={() => handleRemoveTagFromUser(item._id)}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  );
}
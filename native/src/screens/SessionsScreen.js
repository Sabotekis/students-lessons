import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function SessionScreen({ navigation }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://192.168.200.173:5000/api/sessions').then(res => res.json()),
      fetch('http://192.168.200.173:5000/api/sessions/finished').then(res => res.json())
    ])
      .then(([notFinished, finished]) => {
        const allSessions = [
          ...(Array.isArray(notFinished) ? notFinished : []),
          ...(Array.isArray(finished) ? finished : [])
        ];
        setSessions(allSessions);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching sessions:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {sessions.map(session => (
        <View key={session._id} style={styles.card}>
          <Text style={styles.title}>Group: {session.group?.title || 'N/A'}</Text>
          <Text>Start: {new Date(session.startDateTime).toLocaleString()}</Text>
          <Text>End: {new Date(session.endDateTime).toLocaleString()}</Text>
          <Text style={{ color: session.finished ? 'green' : 'orange', fontWeight: 'bold', marginTop: 8 }}>
            {session.finished ? 'Finished' : 'Not Finished'}
          </Text>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SessionDetail', { sessionId: session._id })}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity> */}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
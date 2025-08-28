import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NativeModules } from 'react-native';
const { NotificationModule } = NativeModules;

function formatTime(seconds) {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function NotificationScreen() {
  const [timerOn, setTimerOn] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const keepAliveRef = useRef(null);

  const sendKeepAlive = async () => {
    try {
      await fetch('http://192.168.200.124:5000/api/keepalive', { method: 'POST' });
    } catch (e) {
    }
  };

  const handleToggleTimer = () => {
    if (!timerOn) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
      keepAliveRef.current = setInterval(sendKeepAlive, 5000);
      setTimerOn(true);
      if (NotificationModule && NotificationModule.createAndShowNotification) {
        NotificationModule.createAndShowNotification();
      }
    } else {
      clearInterval(intervalRef.current);
      clearInterval(keepAliveRef.current);
      setTimerOn(false);
      setElapsed(0);
      if (NotificationModule && NotificationModule.clearNotification) {
        NotificationModule.clearNotification();
      }
    }
  };

  return (
    <View style={{ padding: 16, alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          backgroundColor: timerOn ? 'red' : '#007bff',
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 8,
          marginBottom: 16,
        }}
        onPress={handleToggleTimer}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>
          {timerOn ? 'Stop Timer' : 'Start Timer'}
        </Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 32, fontVariant: ['tabular-nums'] }}>
        {formatTime(elapsed)}
      </Text>
    </View>
  );
}
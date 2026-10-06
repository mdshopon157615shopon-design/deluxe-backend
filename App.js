import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import VoiceRoomScreen from './src/screens/VoiceRoomScreen';

export default function App() {
  const [inRoom, setInRoom] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {inRoom ? (
        <VoiceRoomScreen onLeaveRoom={() => setInRoom(false)} />
      ) : (
        <View style={styles.homeContainer}>
          <Text style={styles.title}>Welcome to Deluxe Live</Text>
          <TouchableOpacity style={styles.joinBtn} onPress={() => setInRoom(true)}>
            <Text style={styles.btnText}>Join Voice Party Room 🎙️</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1E' },
  homeContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FFD700', marginBottom: 20 },
  joinBtn: { backgroundColor: '#6200EE', paddingHorizontal: 25, paddingVertical: 15, borderRadius: 10 },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

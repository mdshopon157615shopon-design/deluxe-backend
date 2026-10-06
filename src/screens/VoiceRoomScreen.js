import React, { useState } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, Modal, 
  ScrollView, TextInput, Alert 
} from 'react-native';

export default function VoiceRoomScreen() {
  const [userLevel, setUserLevel] = useState(1);
  const [userCoins, setUserCoins] = useState(5000);
  const [isMuted, setIsMuted] = useState(false);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showVideosModal, setShowVideosModal] = useState(false);

  const [trxId, setTrxId] = useState('');
  const [amount, setAmount] = useState('');

  const handleSendGift = (cost) => {
    if (userCoins < cost) {
      Alert.alert("Insufficient Coins", "Please recharge your coins.");
      return;
    }
    const newCoins = userCoins - cost;
    const addedXp = Math.floor(cost / 10);
    const newLevel = Math.floor((userLevel * 100 + addedXp) / 100);

    setUserCoins(newCoins);
    setUserLevel(newLevel);
    setShowGiftModal(false);
    Alert.alert("🎁 Gift Sent!", `+${addedXp} XP gained! Current Level: ${newLevel}`);
  };

  const handleAgencyApply = () => {
    if (userLevel < 10) {
      Alert.alert("🚫 Application Failed!", `Level 10 is required to apply for Agency. Your current level: ${userLevel}`);
    } else {
      Alert.alert("✅ Success!", "Your agency application has been submitted for admin review.");
    }
  };

  const handleRechargeSubmit = () => {
    if (!trxId || !amount) {
      Alert.alert("Missing Information", "Please enter the amount and Transaction ID.");
      return;
    }
    Alert.alert("Success!", "Payment sent for verification. (bKash/Nagad: 01609121521)");
    setShowRechargeModal(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>⭐ Level {userLevel}</Text>
        </View>
        <Text style={styles.coinBalance}>💎 {userCoins} Coins</Text>
        <TouchableOpacity style={styles.rechargeBtn} onPress={() => setShowRechargeModal(true)}>
          <Text style={styles.rechargeText}>+ Recharge</Text>
        </TouchableOpacity>
      </View>

      {/* 8-Seat Audio Grid */}
      <View style={styles.seatGrid}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((seat) => (
          <View key={seat} style={styles.seatBox}>
            <Text style={styles.seatText}>Seat {seat}</Text>
          </View>
        ))}
      </View>

      {/* Chat Area */}
      <View style={styles.chatBox}>
        <Text style={styles.systemMsg}>System: Poppo Live cluster active. Keep interactions friendly!</Text>
        <Text style={styles.userMsg}>User1: Hello Host! 🔥</Text>
      </View>

      {/* Bottom Toolbar */}
      <View style={styles.bottomToolbar}>
        <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.iconBtn}>
          <Text style={styles.btnText}>{isMuted ? '🔇 Unmute' : '🎙️ Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowGiftModal(true)} style={styles.giftBtn}>
          <Text style={styles.giftBtnText}>🎁 Send Gift</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowVideosModal(true)} style={styles.iconBtn}>
          <Text style={styles.btnText}>📺 34 Videos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowSettings(true)} style={styles.iconBtn}>
          <Text style={styles.btnText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>

      {/* 34 Video Feed Modal */}
      <Modal visible={showVideosModal} animationType="slide">
        <View style={styles.modalBg}>
          <Text style={styles.modalHeader}>🎬 Poppo Featured 34 Video Streams</Text>
          <ScrollView>
            {Array.from({ length: 34 }).map((_, idx) => (
              <View key={idx} style={styles.videoCard}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>🎥 Live Featured Video #{idx + 1}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowVideosModal(false)}>
            <Text style={{color: '#ff2a6d', fontWeight: 'bold'}}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Gifting Modal */}
      <Modal visible={showGiftModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🎁 Select Gift (Earn XP to Level Up)</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15}}>
              <TouchableOpacity style={styles.giftItem} onPress={() => handleSendGift(100)}>
                <Text style={{fontSize: 24}}>🌹</Text>
                <Text style={{color: '#fff'}}>Rose (100)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.giftItem} onPress={() => handleSendGift(1000)}>
                <Text style={{fontSize: 24}}>👑</Text>
                <Text style={{color: '#fff'}}>Crown (1K)</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.giftItem} onPress={() => handleSendGift(5000)}>
                <Text style={{fontSize: 24}}>🚀</Text>
                <Text style={{color: '#fff'}}>Rocket (5K)</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowGiftModal(false)}>
              <Text style={{color: '#ff2a6d'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings & Agency Modal */}
      <Modal visible={showSettings} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚙️ Room Settings & Agency Panel</Text>

            <TouchableOpacity style={styles.menuItem} onPress={handleAgencyApply}>
              <Text style={styles.menuText}>🏢 Apply for Agency (Requires Level 10)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert("Host Apply", "Host form submitted.")}>
              <Text style={styles.menuText}>👑 Apply for Host</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowSettings(false)}>
              <Text style={{color: '#fff'}}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recharge Modal */}
      <Modal visible={showRechargeModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>💳 Manual Payment Gateway</Text>
            <Text style={{color: '#00e5ff', marginBottom: 5}}>bKash / Nagad Send Money: 01609121521</Text>
            <Text style={{color: '#ffd700', fontSize: 11, marginBottom: 10}}>
              100K = 1350 BDT | 50K = 675 BDT | 25K = 340 BDT | 20K = 175 BDT
            </Text>

            <TextInput 
              placeholder="Amount BDT" 
              placeholderTextColor="#888" 
              keyboardType="numeric" 
              style={styles.input} 
              onChangeText={setAmount}
            />

            <TextInput 
              placeholder="Transaction ID (TrxID)" 
              placeholderTextColor="#888" 
              style={styles.input} 
              onChangeText={setTrxId}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleRechargeSubmit}>
              <Text style={styles.submitText}>Submit Payment</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowRechargeModal(false)}>
              <Text style={{color: '#ff2a6d'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c0a1d', paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center' },
  badge: { backgroundColor: '#ffd700', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  badgeText: { color: '#000', fontWeight: 'bold', fontSize: 12 },
  coinBalance: { color: '#00e5ff', fontWeight: 'bold' },
  rechargeBtn: { backgroundColor: '#ff2a6d', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  rechargeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  seatGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginVertical: 15 },
  seatBox: { width: '22%', height: 65, backgroundColor: '#1a173b', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginVertical: 5 },
  seatText: { color: '#888', fontSize: 12 },
  chatBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginHorizontal: 15, borderRadius: 10, padding: 10, justifyContent: 'flex-end' },
  systemMsg: { color: '#ffd700', fontSize: 12, marginBottom: 5 },
  userMsg: { color: '#fff', fontSize: 13 },
  bottomToolbar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, backgroundColor: '#141130' },
  iconBtn: { backgroundColor: '#231f4c', padding: 10, borderRadius: 8 },
  btnText: { color: '#fff', fontSize: 12 },
  giftBtn: { backgroundColor: '#ff2a6d', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 },
  giftBtnText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#181535', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  modalTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  menuItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#282352' },
  menuText: { color: '#00e5ff', fontSize: 14 },
  giftItem: { alignItems: 'center', backgroundColor: '#231f4c', padding: 10, borderRadius: 10, width: '30%' },
  input: { backgroundColor: '#0c0a1d', color: '#fff', padding: 10, borderRadius: 8, marginBottom: 10 },
  submitBtn: { backgroundColor: '#00e5ff', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  submitText: { color: '#000', fontWeight: 'bold' },
  closeBtn: { marginTop: 10, alignItems: 'center', padding: 8 },
  modalBg: { flex: 1, backgroundColor: '#0c0a1d', padding: 20 },
  modalHeader: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  videoCard: { backgroundColor: '#181535', padding: 15, marginVertical: 5, borderRadius: 8 }
});

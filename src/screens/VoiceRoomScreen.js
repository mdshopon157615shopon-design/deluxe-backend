import React, { useState, useRef } from 'react';
import { 
  StyleSheet, View, Text, TouchableOpacity, FlatList, 
  TextInput, KeyboardAvoidingView, Platform, Modal 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VoiceRoomScreen({ roomID = "deluxe_room_1", myUserId = "USER_9988", onLeaveRoom }) {
  const [coins, setCoins] = useState(900);
  const [mySeatId, setMySeatId] = useState(6);
  const [isMuted, setIsMuted] = useState(false);
  const [statusMsg, setStatusMsg] = useState(`Joined as ID: ${myUserId}`);
  const [inputText, setInputText] = useState("");
  const [giftBanner, setGiftBanner] = useState(null);
  
  // Game Modals & Selection States
  const [showGameListModal, setShowGameListModal] = useState(false);
  const [activeGame, setActiveGame] = useState(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStatusText, setGameStatusText] = useState("");

  // Game UI States
  const [selectedCard, setSelectedCard] = useState(null);
  const [diceRollValue, setDiceRollValue] = useState(null);
  
  // Rocket Animation States
  const [rocketMultiplier, setRocketMultiplier] = useState(1.0);
  const [rocketStatus, setRocketStatus] = useState("IDLE");
  const rocketTimerRef = useRef(null);

  const gamesList = [
    { id: 'wheel', name: 'Lucky Wheel', icon: '🎰', desc: 'Spin for 10 coins. Win big or lose!' },
    { id: 'patti', name: 'Teen Patti', icon: '🃏', desc: 'Entry 50 coins. High risk 3-card brag!' },
    { id: 'ludo', name: 'Ludo Express', icon: '🎲', desc: 'Roll 20 coins. Low roll means loss!' },
    { id: 'rocket', name: 'Rocket Crash', icon: '🚀', desc: 'Watch rocket fly! Crash = Loss!' },
  ];

  const [messages, setMessages] = useState([
    { id: '1', user: 'System', text: 'Welcome to Deluxe Party Room! Keep it friendly.', isSystem: true },
    { id: '2', user: 'Host', text: 'Play games & test your luck! 🎰🎲🚀', isSystem: false },
  ]);

  const [seats, setSeats] = useState([
    { id: 1, name: 'Seat 1', userId: 'ID_101', isHost: true, occupiedBy: null, isFollowing: false },
    { id: 2, name: 'Seat 2', userId: 'ID_102', isHost: false, occupiedBy: null, isFollowing: false },
    { id: 3, name: 'Seat 3', userId: 'ID_103', isHost: false, occupiedBy: null, isFollowing: false },
    { id: 4, name: 'Seat 4', userId: 'ID_104', isHost: false, occupiedBy: null, isFollowing: false },
    { id: 5, name: 'Seat 5', userId: 'ID_105', isHost: false, occupiedBy: null, isFollowing: false },
    { id: 6, name: 'You', userId: myUserId, isHost: false, occupiedBy: 'me', isFollowing: false },
    { id: 7, name: 'Seat 7', userId: 'ID_107', isHost: false, occupiedBy: null, isFollowing: false },
    { id: 8, name: 'Seat 8', userId: 'ID_108', isHost: false, occupiedBy: null, isFollowing: false },
  ]);

  // Selected User Modal for Follow & ID View
  const [selectedSeatUser, setSelectedSeatUser] = useState(null);

  const handleSeatPress = (seat) => {
    if (seat.occupiedBy === 'me') {
      const updatedSeats = seats.map(s => s.id === seat.id ? { ...s, name: `Seat ${s.id}`, occupiedBy: null } : s);
      setSeats(updatedSeats);
      setMySeatId(null);
      setStatusMsg(`Left Seat ${seat.id}`);
    } else if (!seat.occupiedBy) {
      let updatedSeats = seats.map(s => {
        if (s.occupiedBy === 'me') return { ...s, name: `Seat ${s.id}`, occupiedBy: null };
        if (s.id === seat.id) return { ...s, name: 'You', occupiedBy: 'me' };
        return s;
      });
      setSeats(updatedSeats);
      setMySeatId(seat.id);
      setStatusMsg(`Joined Seat ${seat.id}`);
    } else {
      // Open User Profile / Follow Modal when clicking another user
      setSelectedSeatUser(seat);
    }
  };

  const toggleFollowUser = (seatId) => {
    setSeats(prev => prev.map(s => {
      if (s.id === seatId) {
        const nextFollow = !s.isFollowing;
        setStatusMsg(nextFollow ? `Followed User (${s.userId})` : `Unfollowed User (${s.userId})`);
        return { ...s, isFollowing: nextFollow };
      }
      return s;
    }));
    setSelectedSeatUser(null);
  };

  const toggleMic = () => {
    if (!mySeatId) {
      setStatusMsg("Please take a seat first to use Mic!");
      return;
    }
    setIsMuted(!isMuted);
    setStatusMsg(!isMuted ? "Microphone Muted" : "Microphone Unmuted");
  };

  const handleSendGift = () => {
    if (coins >= 50) {
      setCoins(coins - 50);
      setGiftBanner("🎉 YOU SENT A DELUXE GIFT! 🎁✨");
      setTimeout(() => setGiftBanner(null), 2500);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), user: 'You', text: 'Sent a Deluxe Gift 🎁', isGift: true }
      ]);
    } else {
      setStatusMsg("⚠️ Insufficient Coins!");
    }
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    const newMsg = {
      id: Date.now().toString(),
      user: mySeatId ? `You (${myUserId})` : 'Audience',
      text: inputText.trim()
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  const announceResult = (msgText, isWin) => {
    setMessages(prev => [
      ...prev,
      { 
        id: Date.now().toString(), 
        user: isWin ? '🏆 GAME WIN' : '💥 GAME LOSS', 
        text: msgText, 
        isGift: true 
      }
    ]);
  };

  const openGameScreen = (gameId) => {
    setShowGameListModal(false);
    setGameStatusText("");
    setSelectedCard(null);
    setDiceRollValue(null);
    setRocketMultiplier(1.0);
    setRocketStatus("IDLE");
    if (rocketTimerRef.current) clearInterval(rocketTimerRef.current);
    setActiveGame(gameId);
  };

  // Rocket Game Logic
  const playRocketCrash = () => {
    if (coins < 30) { setGameStatusText("⚠️ Need 30 Coins!"); return; }
    setIsPlaying(true);
    setCoins(c => c - 30);
    setRocketMultiplier(1.0);
    setRocketStatus("FLYING");
    setGameStatusText("Rocket Flying... Watch out! 🚀");

    const willCrashEarly = Math.random() < 0.45;
    const targetCrashPoint = willCrashEarly 
      ? parseFloat((1.1 + Math.random() * 0.4).toFixed(2)) 
      : parseFloat((1.5 + Math.random() * 3.0).toFixed(2));

    let currentMult = 1.0;

    rocketTimerRef.current = setInterval(() => {
      currentMult = parseFloat((currentMult + 0.1).toFixed(2));
      setRocketMultiplier(currentMult);

      if (currentMult >= targetCrashPoint) {
        clearInterval(rocketTimerRef.current);
        
        if (willCrashEarly) {
          setRocketStatus("CRASHED");
          const msg = `💥 CRASHED at ${currentMult}x! Lost 30 Coins!`;
          setGameStatusText(msg);
          announceResult(`Rocket: ${msg}`, false);
        } else {
          setRocketStatus("SUCCESS");
          const winCoins = Math.round(30 * currentMult);
          setCoins(c => c + winCoins);
          const msg = `🚀 Landed Safely at ${currentMult}x! Won ${winCoins} Coins! 🎉`;
          setGameStatusText(msg);
          announceResult(`Rocket: ${msg}`, true);
        }
        setIsPlaying(false);
      }
    }, 200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.container}
      >
        {/* Top Header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.roomTitle}>🎙️ Deluxe Party Room</Text>
            <Text style={styles.roomId}>ID: {roomID} | My ID: {myUserId}</Text>
          </View>
          
          <View style={styles.rightHeader}>
            <TouchableOpacity style={styles.gameBtn} onPress={() => setShowGameListModal(true)}>
              <Text style={styles.gameBtnText}>🎰 Games</Text>
            </TouchableOpacity>
            <View style={styles.walletBadge}>
              <Text style={styles.coinText}>🪙 {coins}</Text>
            </View>
            {/* LEAVE ROOM BUTTON (রুম কেটে বের হওয়ার অপশন) */}
            <TouchableOpacity style={styles.exitBtn} onPress={onLeaveRoom}>
              <Text style={styles.exitText}>📞 Leave</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <Text style={styles.statusBannerText}>{statusMsg}</Text>
        </View>

        {/* Gift Banner */}
        {giftBanner && (
          <View style={styles.giftPopupContainer}>
            <Text style={styles.giftPopupText}>{giftBanner}</Text>
          </View>
        )}

        {/* Seats Grid */}
        <View style={styles.seatGridContainer}>
          <FlatList
            data={seats}
            numColumns={4}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isMe = item.occupiedBy === 'me';
              return (
                <TouchableOpacity style={styles.seatCard} onPress={() => handleSeatPress(item)}>
                  <View style={[
                    styles.avatarCircle, 
                    item.isHost && styles.hostBorder,
                    isMe && styles.mySeatBorder,
                    (isMe && !isMuted) && styles.speakingGlow
                  ]}>
                    <Text style={styles.avatarText}>
                      {item.isHost ? '👑' : (isMe ? (isMuted ? '🎙️❌' : '🎙⚡') : '🎙️')}
                    </Text>
                  </View>
                  <Text style={[styles.seatName, isMe && styles.mySeatName]}>{item.name}</Text>
                  <Text style={styles.seatUserId}>{item.userId}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Live Chat Section */}
        <View style={styles.chatSection}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            style={styles.chatList}
            contentContainerStyle={{ paddingVertical: 5 }}
            renderItem={({ item }) => (
              <View style={[styles.chatBubble, item.isSystem && styles.systemBubble, item.isGift && styles.giftBubble]}>
                <Text style={styles.chatUser}>{item.user}: </Text>
                <Text style={[styles.chatText, item.isSystem && styles.systemText, item.isGift && styles.giftTextMsg]}>
                  {item.text}
                </Text>
              </View>
            )}
          />

          {/* Chat Input */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              placeholder="Say something..."
              placeholderTextColor="#777"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.sendMsgBtn} onPress={handleSendMessage}>
              <Text style={styles.sendMsgText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomBar}>
          <TouchableOpacity 
            style={[styles.micBtn, isMuted && styles.micMutedBtn, !mySeatId && styles.disabledBtn]} 
            onPress={toggleMic}
          >
            <Text style={styles.btnIcon}>{!mySeatId ? '🔇' : (isMuted ? '❌' : '🎤')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.giftBtn} onPress={handleSendGift}>
            <Text style={styles.btnIcon}>🎁</Text>
            <Text style={styles.giftText}>Send Gift (50 🪙)</Text>
          </TouchableOpacity>
        </View>

        {/* User Profile / Follow Modal */}
        {selectedSeatUser && (
          <Modal transparent={true} animationType="slide" visible={!!selectedSeatUser}>
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { alignItems: 'center', padding: 20 }]}>
                <Text style={{ fontSize: 40, marginBottom: 10 }}>👤</Text>
                <Text style={styles.modalTitle}>{selectedSeatUser.name}</Text>
                <Text style={{ color: '#888', marginBottom: 15 }}>ID: {selectedSeatUser.userId}</Text>

                <TouchableOpacity 
                  style={[
                    styles.followBtn, 
                    selectedSeatUser.isFollowing && styles.followingBtn
                  ]} 
                  onPress={() => toggleFollowUser(selectedSeatUser.id)}
                >
                  <Text style={styles.followBtnText}>
                    {selectedSeatUser.isFollowing ? '✓ Following' : '+ Follow'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={{ marginTop: 15 }} 
                  onPress={() => setSelectedSeatUser(null)}
                >
                  <Text style={{ color: '#FF3333', fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        {/* Games List Modal */}
        <Modal
          visible={showGameListModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGameListModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>🎮 Party Games</Text>
                <TouchableOpacity onPress={() => setShowGameListModal(false)}>
                  <Text style={styles.closeModalBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={gamesList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.gameCard} onPress={() => openGameScreen(item.id)}>
                    <Text style={styles.gameIcon}>{item.icon}</Text>
                    <View style={styles.gameInfo}>
                      <Text style={styles.gameName}>{item.name}</Text>
                      <Text style={styles.gameDesc}>{item.desc}</Text>
                    </View>
                    <Text style={styles.playBtnText}>PLAY ▶</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Active Game Modal Screen */}
        <Modal
          visible={activeGame !== null}
          transparent={true}
          animationType="fade"
          onRequestClose={() => {
            if (rocketTimerRef.current) clearInterval(rocketTimerRef.current);
            setActiveGame(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { alignItems: 'center', paddingVertical: 25 }]}>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 }}>
                <Text style={styles.modalTitle}>
                  {activeGame === 'rocket' && '🚀 Rocket Crash'}
                </Text>
                <TouchableOpacity onPress={() => {
                  if (rocketTimerRef.current) clearInterval(rocketTimerRef.current);
                  setActiveGame(null);
                }}>
                  <Text style={styles.closeModalBtn}>✕</Text>
                </TouchableOpacity>
              </View>

              {activeGame === 'rocket' && (
                <View style={[
                  styles.rocketVisualBox, 
                  rocketStatus === 'CRASHED' && styles.crashedBox,
                  rocketStatus === 'SUCCESS' && styles.successBox
                ]}>
                  <Text style={{ fontSize: 48 }}>
                    {rocketStatus === 'FLYING' ? '🚀💨' : (rocketStatus === 'CRASHED' ? '💥' : '🚀✨')}
                  </Text>
                  <Text style={styles.multiplierText}>
                    {rocketStatus === 'CRASHED' ? `CRASH @ ${rocketMultiplier}x` : `${rocketMultiplier.toFixed(1)}x`}
                  </Text>
                </View>
              )}

              {gameStatusText ? (
                <Text style={styles.resultText}>{gameStatusText}</Text>
              ) : null}

              <TouchableOpacity 
                style={[styles.actionBtn, isPlaying && { opacity: 0.6 }]} 
                onPress={() => {
                  if (activeGame === 'rocket') playRocketCrash();
                }}
                disabled={isPlaying}
              >
                <Text style={styles.actionBtnText}>
                  {isPlaying ? 'FLYING...' : 'LAUNCH (30 🪙)'}
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0B0B1E' },
  container: { flex: 1, backgroundColor: '#0B0B1E', justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#1A1A3A' },
  roomTitle: { color: '#FFD700', fontSize: 14, fontWeight: 'bold' },
  roomId: { color: '#888', fontSize: 10 },
  rightHeader: { flexDirection: 'row', alignItems: 'center' },
  gameBtn: { backgroundColor: '#4A154B', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12, marginRight: 5, borderWidth: 1, borderColor: '#FFD700' },
  gameBtnText: { color: '#FFD700', fontSize: 10, fontWeight: 'bold' },
  walletBadge: { backgroundColor: '#2A1A4A', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12, marginRight: 5 },
  coinText: { color: '#FFD700', fontWeight: 'bold', fontSize: 11 },
  exitBtn: { backgroundColor: '#E63946', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  exitText: { color: '#FFF', fontWeight: 'bold', fontSize: 11 },
  
  statusBanner: { backgroundColor: '#1E1E3F', paddingVertical: 4, paddingHorizontal: 10, alignItems: 'center' },
  statusBannerText: { color: '#A0A0E0', fontSize: 11, fontWeight: '500' },

  giftPopupContainer: { backgroundColor: 'rgba(255, 215, 0, 0.95)', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, alignSelf: 'center', marginVertical: 4 },
  giftPopupText: { color: '#000', fontWeight: 'bold', fontSize: 12 },

  seatGridContainer: { paddingVertical: 6, alignItems: 'center' },
  seatCard: { alignItems: 'center', marginHorizontal: 8, marginVertical: 4 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1E1E3F', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#3A3A6A' },
  hostBorder: { borderColor: '#FFD700' },
  mySeatBorder: { borderColor: '#00FF88', backgroundColor: '#1A3A2A' },
  speakingGlow: { borderWidth: 3, borderColor: '#00FF88' },
  avatarText: { fontSize: 16 },
  seatName: { color: '#CCC', fontSize: 10, marginTop: 2, fontWeight: '500' },
  seatUserId: { color: '#666', fontSize: 8 },
  mySeatName: { color: '#00FF88', fontWeight: 'bold' },

  chatSection: { flex: 1, backgroundColor: '#0F0F28', marginHorizontal: 12, borderRadius: 12, padding: 8, justifyContent: 'space-between', marginBottom: 5 },
  chatList: { flex: 1 },
  chatBubble: { flexDirection: 'row', backgroundColor: '#1A1A3A', padding: 6, borderRadius: 8, marginBottom: 5, alignSelf: 'flex-start' },
  systemBubble: { backgroundColor: '#2A1A3A' },
  giftBubble: { backgroundColor: '#3A2A1A', borderWidth: 1, borderColor: '#FFD700' },
  chatUser: { color: '#FFD700', fontWeight: 'bold', fontSize: 11 },
  chatText: { color: '#FFF', fontSize: 11 },
  systemText: { color: '#A0A0FF' },
  giftTextMsg: { color: '#00FF88', fontWeight: 'bold' },

  inputRow: { flexDirection: 'row', marginTop: 4, alignItems: 'center' },
  textInput: { flex: 1, backgroundColor: '#1A1A3A', color: '#FFF', borderRadius: 15, paddingHorizontal: 12, paddingVertical: 6, fontSize: 12 },
  sendMsgBtn: { backgroundColor: '#00FF88', marginLeft: 6, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 15 },
  sendMsgText: { color: '#000', fontWeight: 'bold', fontSize: 12 },

  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, marginBottom: 30, backgroundColor: '#12122C', borderTopWidth: 1, borderTopColor: '#1A1A3A' },
  micBtn: { backgroundColor: '#252550', padding: 10, borderRadius: 25 },
  micMutedBtn: { backgroundColor: '#502525' },
  disabledBtn: { opacity: 0.5 },
  giftBtn: { backgroundColor: '#FFD700', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  btnIcon: { fontSize: 16 },
  giftText: { color: '#000', fontWeight: 'bold', marginLeft: 5, fontSize: 12 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', paddingHorizontal: 20 },
  modalContent: { backgroundColor: '#12122C', borderRadius: 20, padding: 16, maxHeight: '80%', borderWidth: 1, borderColor: '#3A3A6A' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#2A2A4A', paddingBottom: 10 },
  modalTitle: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  closeModalBtn: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  gameCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A3A', padding: 12, borderRadius: 12, marginBottom: 10 },
  gameIcon: { fontSize: 24, marginRight: 12 },
  gameInfo: { flex: 1 },
  gameName: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  gameDesc: { color: '#888', fontSize: 11 },
  playBtnText: { color: '#00FF88', fontWeight: 'bold', fontSize: 12 },

  rocketVisualBox: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1A1A3A', justifyContent: 'center', alignItems: 'center', marginVertical: 15, borderWidth: 3, borderColor: '#FFD700' },
  crashedBox: { borderColor: '#FF3333', backgroundColor: '#3A1A1A' },
  successBox: { borderColor: '#00FF88', backgroundColor: '#1A3A2A' },
  multiplierText: { color: '#FFD700', fontWeight: 'bold', fontSize: 15, marginTop: 5 },

  followBtn: { backgroundColor: '#00FF88', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 10 },
  followingBtn: { backgroundColor: '#3A3A6A' },
  followBtnText: { color: '#000', fontWeight: 'bold' },

  actionBtn: { backgroundColor: '#FFD700', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 25, marginTop: 12 },
  actionBtnText: { color: '#000', fontWeight: 'bold', fontSize: 13 },
  resultText: { color: '#00FF88', fontWeight: 'bold', fontSize: 13, marginVertical: 8, textAlign: 'center' }
});

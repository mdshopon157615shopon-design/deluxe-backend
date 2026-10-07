import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Alert 
} from 'react-native';

const StoreScreen = ({ userId, userCoins, refreshUser }) => {
  const [selectedTab, setSelectedTab] = useState('AVATAR_FRAME');
  const [items, setItems] = useState([]);

  // Fetch store items from the backend API
  useEffect(() => {
    fetchStoreItems();
  }, []);

  const fetchStoreItems = async () => {
    try {
      const response = await fetch('YOUR_BACKEND_URL/api/store/items');
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  // Handle purchasing store items
  const handleBuy = async (itemId, price) => {
    if (userCoins < price) {
      Alert.alert('Insufficient Coins', 'Please recharge your coin balance.');
      return;
    }

    try {
      const response = await fetch('YOUR_BACKEND_URL/api/store/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, itemId }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success!', 'Item purchased successfully.');
        if (refreshUser) refreshUser();
      } else {
        Alert.alert('Failed', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to connect to the server.');
    }
  };

  const filteredItems = items.filter(item => item.type === selectedTab);

  return (
    <View style={styles.container}>
      {/* Header and Coin Balance */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Deluxe Store</Text>
        <Text style={styles.coinText}>🪙 {userCoins} Coins</Text>
      </View>

      {/* Category Tabs */}
      <View style={styles.tabContainer}>
        {['AVATAR_FRAME', 'ENTRANCE_EFFECT', 'VIP_BADGE'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Item List Grid */}
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.previewUrl }} style={styles.itemImage} />
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemPrice}>🪙 {item.priceInCoins}</Text>
            <TouchableOpacity 
              style={styles.buyButton} 
              onPress={() => handleBuy(item._id, item.priceInCoins)}
            >
              <Text style={styles.buyButtonText}>Buy</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  headerTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  coinText: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#222' },
  activeTab: { backgroundColor: '#FFD700' },
  tabText: { color: '#AAA', fontSize: 12, fontWeight: 'bold' },
  activeTabText: { color: '#000' },
  card: { flex: 1, margin: 8, backgroundColor: '#1E1E1E', borderRadius: 10, padding: 10, alignItems: 'center' },
  itemImage: { width: 80, height: 80, borderRadius: 10, marginBottom: 8 },
  itemTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  itemPrice: { color: '#FFD700', marginVertical: 4 },
  buyButton: { backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 6, borderRadius: 15, marginTop: 5 },
  buyButtonText: { color: '#000', fontWeight: 'bold' }
});

export default StoreScreen;

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';

export default function StoreScreen() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://deluxe-backend-1.onrender.com/api/store/items')
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deluxe Live Store</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemName}>{item.name || 'Store Item'}</Text>
              <Text style={styles.itemPrice}>Price: {item.price || 0} Coins</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5', marginTop: 40 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10 },
  itemName: { fontSize: 18, fontWeight: '600' },
  itemPrice: { fontSize: 14, color: '#666', marginTop: 5 },
});

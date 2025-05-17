import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BobaEntry, getAllBobaEntries, getBobaCount, getTotalSpent } from '../../utils/storage';

export default function HomeScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const isFocused = useIsFocused();
  const [recentEntries, setRecentEntries] = useState<BobaEntry[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [bobaCount, setBobaCount] = useState(0);
  const [storesCount, setStoresCount] = useState(0);

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const loadData = async () => {
    try {
      // Use real data from storage
      const entries = await getAllBobaEntries();
      setRecentEntries(entries.slice(0, 5));
      setTotalSpent(await getTotalSpent());
      setBobaCount(await getBobaCount());
      
      // Calculate unique stores
      const uniqueStores = new Set(entries.map(entry => entry.shopName));
      setStoresCount(uniqueStores.size);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Hi John,</Text>
        <Text style={[styles.title, { color: colors.text }]}>Let's track your boba!</Text>
      </View>
      
      <Text style={[styles.sectionTitle, { color: colors.text }]}>This Month</Text>
      
      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardSmall, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{bobaCount}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>DRINKS</Text>
        </View>
        
        <View style={[styles.statCard, styles.statCardSmall, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{storesCount}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>STORES</Text>
        </View>
        
        <View style={[styles.statCard, styles.statCardWide, { backgroundColor: colors.card }]}>
          <Text style={[styles.statValue, { color: colors.text }]}>{formatPrice(totalSpent)}</Text>
          <Text style={[styles.statLabel, { color: colors.text }]}>SPENT</Text>
        </View>
      </View>
      
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Recent Drinks</Text>
        <FontAwesome name="filter" size={20} color={colors.text} />
      </View>
      
      {recentEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No drinks added yet. Add your first boba drink!
          </Text>
        </View>
      ) : (
        recentEntries.map((item) => (
          <TouchableOpacity key={item.id} style={[styles.drinkCard, { backgroundColor: colors.card }]}>
            <View style={styles.drinkContent}>
              <Image 
                source={{ uri: item.imageUri }} 
                style={styles.drinkImage}
              />
              <View style={styles.drinkNameContainer}>
                <Text style={[styles.drinkName, { color: colors.text }]}>{item.flavor}</Text>
              </View>
              <FontAwesome name="chevron-right" size={20} color={colors.text} style={styles.drinkArrow} />
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '400',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statCardSmall: {
    flex: 0.8,
  },
  statCardWide: {
    flex: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  drinkCard: {
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  drinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drinkImage: {
    width: 140,
    height: 140,
  },
  drinkNameContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  drinkName: {
    fontSize: 22,
    fontWeight: '500',
  },
  drinkArrow: {
    marginRight: 15,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
  },
});

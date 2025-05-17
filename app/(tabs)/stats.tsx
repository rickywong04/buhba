import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Colors from '../../constants/Colors';
import {
    BobaEntry,
    getAllBobaEntries,
    getBobaCount,
    getMostFrequentFlavor,
    getTotalSpent
} from '../../utils/storage';

export default function StatsScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const isFocused = useIsFocused();
  
  const [totalSpent, setTotalSpent] = useState(0);
  const [drinkCount, setDrinkCount] = useState(0);
  const [flavorCount, setFlavorCount] = useState(0);
  const [storeCount, setStoreCount] = useState(0);
  const [topFlavor, setTopFlavor] = useState({ flavor: 'None', count: 0 });
  const [monthlyData, setMonthlyData] = useState<{month: string; total: number}[]>([]);
  const [shopData, setShopData] = useState<{shop: string; count: number}[]>([]);

  useEffect(() => {
    if (isFocused) {
      loadStats();
    }
  }, [isFocused]);

  const loadStats = async () => {
    try {
      // Get entries from database
      const entries = await getAllBobaEntries();
      const count = await getBobaCount();
      const total = await getTotalSpent();
      const favFlavor = await getMostFrequentFlavor();
      
      setDrinkCount(count);
      setTotalSpent(total);
      setTopFlavor(favFlavor);
      
      // Count unique flavors
      const uniqueFlavors = new Set(entries.map(entry => entry.flavor));
      setFlavorCount(uniqueFlavors.size);
      
      // Count unique shops
      const uniqueShops = new Set(entries.map(entry => entry.shopName));
      setStoreCount(uniqueShops.size);
      
      // Calculate monthly data
      const monthlyStats = calculateMonthlyStats(entries);
      setMonthlyData(monthlyStats);
      
      // Calculate shop statistics
      const shopStats = calculateShopStats(entries);
      setShopData(shopStats);
      
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const calculateMonthlyStats = (entries: BobaEntry[]) => {
    const months: Record<string, { total: number }> = {};
    
    entries.forEach(entry => {
      const date = new Date(entry.date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!months[monthYear]) {
        months[monthYear] = { total: 0 };
      }
      
      months[monthYear].total += entry.price;
    });
    
    return Object.entries(months)
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => {
        // Sort by most recent month
        const [aMonth, aYear] = a.month.split(' ');
        const [bMonth, bYear] = b.month.split(' ');
        
        if (aYear !== bYear) return parseInt(bYear) - parseInt(aYear);
        
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthOrder.indexOf(bMonth) - monthOrder.indexOf(aMonth);
      })
      .slice(0, 6); // Last 6 months
  };
  
  const calculateShopStats = (entries: BobaEntry[]) => {
    const shops: Record<string, number> = {};
    
    entries.forEach(entry => {
      if (!shops[entry.shopName]) {
        shops[entry.shopName] = 0;
      }
      
      shops[entry.shopName] += 1;
    });
    
    return Object.entries(shops)
      .map(([shop, count]) => ({ shop, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 shops
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
      
      <Text style={[styles.title, { color: colors.text }]}>Your Boba Stats</Text>
      
      {/* Circular stats indicators */}
      <View style={styles.circleStatsContainer}>
        <View style={styles.circleRow}>
          <View style={styles.circleAndLabel}>
            <View style={styles.circle}>
              <Text style={styles.circleNumber}>{drinkCount}</Text>
              <Text style={styles.circleLabel}>DRINKS</Text>
            </View>
          </View>
          
          <View style={styles.connector} />
          
          <View style={styles.circleAndLabel}>
            <View style={styles.circle}>
              <Text style={styles.circleNumber}>{storeCount}</Text>
              <Text style={styles.circleLabel}>STORES</Text>
            </View>
          </View>
          
          <View style={styles.connector} />
          
          <View style={styles.circleAndLabel}>
            <View style={styles.circle}>
              <Text style={styles.circleNumber}>{flavorCount}</Text>
              <Text style={styles.circleLabel}>FLAVORS</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Total spent section */}
      <View style={styles.totalSpentContainer}>
        <Text style={styles.dollarAmount}>{formatPrice(totalSpent)}</Text>
        <Text style={styles.totalLabel}>TOTAL SPENT</Text>
      </View>
      
      {/* Favorite flavor section */}
      <Text style={styles.sectionTitle}>Your Favorite Flavor</Text>
      <View style={styles.favoriteFlavorCard}>
        <Text style={styles.favoriteFlavor}>{topFlavor.flavor}</Text>
        <Text style={styles.favoriteSubtext}>
          Enjoyed {topFlavor.count} {topFlavor.count === 1 ? 'time' : 'times'}
        </Text>
      </View>
      
      {/* Top shops section */}
      <Text style={styles.sectionTitle}>Top Shops</Text>
      <View style={styles.shopCard}>
        {shopData.map((shop, index) => (
          <View key={index} style={styles.shopRow}>
            <Text style={styles.shopName}>{shop.shop}</Text>
            <Text style={styles.visitCount}>
              {shop.count} {shop.count === 1 ? 'visit' : 'visits'}
            </Text>
          </View>
        ))}
      </View>
      
      {/* Monthly breakdown section */}
      <Text style={styles.sectionTitle}>Monthly Breakdown</Text>
      <View style={styles.monthlyCard}>
        {monthlyData.map((month, index) => (
          <View key={index} style={styles.monthRow}>
            <Text style={styles.monthName}>{month.month}</Text>
            <Text style={styles.monthAmount}>{formatPrice(month.total)}</Text>
          </View>
        ))}
      </View>
      
      {/* Footer message */}
      <Text style={styles.footerText}>
        Want to see more stats?{'\n'}
        Keep tracking your boba adventures!
      </Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#604A44',
    marginLeft: 10,
  },
  circleStatsContainer: {
    marginBottom: 30,
  },
  circleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleAndLabel: {
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F9F1E1', // Cream color from the image
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleNumber: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#604A44',
  },
  circleLabel: {
    fontSize: 14,
    color: '#604A44',
    marginTop: 4,
  },
  connector: {
    width: 40,
    height: 4,
    backgroundColor: '#604A44', // Brown color
  },
  totalSpentContainer: {
    marginVertical: 30,
    marginLeft: 10,
  },
  dollarAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#604A44',
  },
  totalLabel: {
    fontSize: 18,
    color: '#604A44',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#604A44',
    marginBottom: 10,
    marginLeft: 10,
  },
  favoriteFlavorCard: {
    backgroundColor: '#F9F1E1',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  favoriteFlavor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E49E4C', // Orange color from the image
    textAlign: 'center',
  },
  favoriteSubtext: {
    fontSize: 16,
    color: '#604A44',
    textAlign: 'center',
    marginTop: 5,
  },
  shopCard: {
    backgroundColor: '#F9F1E1',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  shopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  shopName: {
    fontSize: 18,
    color: '#604A44',
  },
  visitCount: {
    fontSize: 18,
    color: '#E49E4C', // Orange color
  },
  monthlyCard: {
    backgroundColor: '#F9F1E1',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  monthName: {
    fontSize: 18,
    color: '#604A44',
  },
  monthAmount: {
    fontSize: 18,
    color: '#E49E4C', // Orange color
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#604A44',
    marginTop: 20,
    marginBottom: 30,
    fontStyle: 'italic',
  }
});


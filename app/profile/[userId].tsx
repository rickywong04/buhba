import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme, ScrollView, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

// Filler user data
const userData: { [key: string]: any } = {
  'allen': {
    name: 'Allen Chen',
    joinDate: 'November 2025',
    stats: { drinks: 13, flavors: 5, stores: 7 },
    goToOrder: {
      flavor: 'Strawberry Matcha Latte',
      sugarLevel: '75% Sugar',
      iceLevel: 'No Ice',
      toppings: 'Mango Popping Boba',
      store: 'Tsaocaa in West Lafayette, IN',
    },
    gallery: [
      { id: 1, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', date: '5/16/2025' },
      { id: 2, image: 'https://images.unsplash.com/photo-1623662184276-fbaa833be8a0?w=400', date: '5/2/2025' },
      { id: 3, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400', date: '4/18/2025' },
      { id: 4, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', date: '4/5/2025' },
    ],
  },
  'mahi': {
    name: 'Mahi Patel',
    joinDate: 'October 2025',
    stats: { drinks: 22, flavors: 8, stores: 5 },
    goToOrder: {
      flavor: 'Taro Milk Tea',
      sugarLevel: '50% Sugar',
      iceLevel: 'Regular Ice',
      toppings: 'Tapioca Pearls',
      store: 'Latea in West Lafayette, IN',
    },
    gallery: [
      { id: 1, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400', date: '5/14/2025' },
      { id: 2, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', date: '5/10/2025' },
      { id: 3, image: 'https://images.unsplash.com/photo-1623662184276-fbaa833be8a0?w=400', date: '5/3/2025' },
      { id: 4, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400', date: '4/28/2025' },
    ],
  },
  'ricky': {
    name: 'Ricky Wong',
    joinDate: 'September 2025',
    stats: { drinks: 18, flavors: 12, stores: 9 },
    goToOrder: {
      flavor: 'Mango Slush Tea',
      sugarLevel: '100% Sugar',
      iceLevel: 'Extra Ice',
      toppings: 'Lychee Jelly',
      store: 'Feng Cha in Austin, TX',
    },
    gallery: [
      { id: 1, image: 'https://images.unsplash.com/photo-1623662184276-fbaa833be8a0?w=400', date: '5/12/2025' },
      { id: 2, image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400', date: '5/8/2025' },
      { id: 3, image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400', date: '5/1/2025' },
      { id: 4, image: 'https://images.unsplash.com/photo-1623662184276-fbaa833be8a0?w=400', date: '4/22/2025' },
    ],
  },
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  const user = userData[userId as string] || userData['allen'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="bars" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>buhba</Text>
        <TouchableOpacity style={styles.profileButton}>
          <FontAwesome name="user-circle-o" size={28} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatarLarge, { backgroundColor: colors.card }]}>
            <FontAwesome name="user" size={80} color={colors.text} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{user.name}</Text>
            <Text style={[styles.joinDate, { color: colors.secondaryText }]}>
              buhba user since
            </Text>
            <Text style={[styles.joinDateValue, { color: colors.secondaryText, fontStyle: 'italic' }]}>
              {user.joinDate}
            </Text>

            <TouchableOpacity style={styles.followButton}>
              <FontAwesome name="plus" size={16} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{user.stats.drinks}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>DRINKS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{user.stats.flavors}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>FLAVORS</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>{user.stats.stores}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>STORES</Text>
          </View>
        </View>

        {/* Go-To Order */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>Go-To Order</Text>

          <View style={styles.orderDetails}>
            <View style={styles.orderRow}>
              <Text style={[styles.orderLabel, { color: colors.text }]}>Flavor</Text>
              <Text style={[styles.orderValue, { color: colors.text }]}>{user.goToOrder.flavor}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={[styles.orderLabel, { color: colors.text }]}>Sugar Level</Text>
              <Text style={[styles.orderValue, { color: colors.text }]}>{user.goToOrder.sugarLevel}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={[styles.orderLabel, { color: colors.text }]}>Ice Level</Text>
              <Text style={[styles.orderValue, { color: colors.text }]}>{user.goToOrder.iceLevel}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={[styles.orderLabel, { color: colors.text }]}>Toppings</Text>
              <Text style={[styles.orderValue, { color: colors.text }]}>{user.goToOrder.toppings}</Text>
            </View>
            <View style={styles.orderRow}>
              <Text style={[styles.orderLabel, { color: colors.text }]}>Store</Text>
              <Text style={[styles.orderValue, { color: colors.text }]}>{user.goToOrder.store}</Text>
            </View>
          </View>
        </View>

        {/* Gallery */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>Gallery</Text>

          <View style={styles.gallery}>
            {user.gallery.map((item: any) => (
              <View key={item.id} style={styles.galleryItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.galleryImage}
                  resizeMode="cover"
                />
                <Text style={[styles.galleryDate, { color: colors.text }]}>{item.date}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarLarge: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  joinDate: {
    fontSize: 14,
  },
  joinDateValue: {
    fontSize: 14,
    marginBottom: 15,
  },
  followButton: {
    flexDirection: 'row',
    backgroundColor: '#EE961F',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#CCC',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  orderDetails: {
    gap: 10,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  orderLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderValue: {
    fontSize: 16,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    position: 'relative',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  galleryDate: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 4,
    borderRadius: 6,
  },
});

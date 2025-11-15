import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, useColorScheme, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

// Filler data
const leaderboardData = [
  { id: 1, name: 'Sam', bobas: 15, rank: 1, position: 'top' },
  { id: 2, name: 'Ben', bobas: 13, rank: 2, position: 'left' },
  { id: 3, name: 'Anna', bobas: 8, rank: 3, position: 'right' },
];

const feedData = [
  {
    id: 1,
    userName: 'Allen',
    userId: 'allen',
    timestamp: '1h ago',
    shopName: 'Tsaocaa',
    location: 'West Lafayette, IN',
    drinkName: 'Strawberry Matcha Boba',
    caption: '"getting my weekly boba"',
    rating: 2,
    drinkImage: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
  },
  {
    id: 2,
    userName: 'Mahi',
    userId: 'mahi',
    timestamp: '3 days ago',
    shopName: 'Latea',
    location: 'West Lafayette, IN',
    drinkName: 'Taro Milk Tea',
    caption: '"ju na forced me to..."',
    rating: 3,
    drinkImage: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400',
  },
  {
    id: 3,
    userName: 'Ricky',
    userId: 'ricky',
    timestamp: 'Oct. 28',
    shopName: 'Feng Cha',
    location: 'Austin, TX',
    drinkName: 'Mango Slush Tea',
    caption: '"scouting for potentials"',
    rating: 1,
    drinkImage: 'https://images.unsplash.com/photo-1623662184276-fbaa833be8a0?w=400',
  },
];

const RatingEmojis = ({ rating }: { rating: number }) => {
  const emojis = ['😢', '😐', '😊', '😁'];
  return (
    <View style={styles.ratingContainer}>
      {emojis.map((emoji, index) => (
        <Text
          key={index}
          style={[
            styles.ratingEmoji,
            index === rating && styles.selectedEmoji
          ]}
        >
          {emoji}
        </Text>
      ))}
    </View>
  );
};

const LeaderboardPodium = ({ colorScheme }: { colorScheme: 'light' | 'dark' }) => {
  const colors = Colors[colorScheme];

  return (
    <View style={styles.podiumContainer}>
      {/* Left position - 3rd place */}
      <View style={styles.podiumPerson}>
        <View style={[styles.avatarContainer, styles.avatarThird]}>
          <View style={[styles.avatar, { backgroundColor: colors.card }]}>
            <FontAwesome name="user" size={40} color={colors.text} />
          </View>
          <View style={[styles.rankBadge, styles.rankThird]}>
            <Text style={styles.rankText}>3</Text>
          </View>
        </View>
        <Text style={[styles.leaderName, { color: colors.text }]}>
          {leaderboardData.find(p => p.rank === 3)?.name}
        </Text>
        <Text style={[styles.bobaCount, { color: colors.secondaryText }]}>
          {leaderboardData.find(p => p.rank === 3)?.bobas} bobas
        </Text>
      </View>

      {/* Center position - 1st place (elevated) */}
      <View style={[styles.podiumPerson, styles.firstPlace]}>
        <View style={[styles.avatarContainer, styles.avatarFirst]}>
          <View style={[styles.avatar, styles.avatarLarge, { backgroundColor: colors.card }]}>
            <FontAwesome name="user" size={60} color={colors.text} />
          </View>
          <View style={[styles.rankBadge, styles.rankFirst]}>
            <Text style={styles.rankText}>1</Text>
          </View>
        </View>
        <Text style={[styles.leaderName, { color: colors.text }]}>
          {leaderboardData.find(p => p.rank === 1)?.name}
        </Text>
        <Text style={[styles.bobaCount, { color: colors.secondaryText }]}>
          {leaderboardData.find(p => p.rank === 1)?.bobas} bobas
        </Text>
      </View>

      {/* Right position - 2nd place */}
      <View style={styles.podiumPerson}>
        <View style={[styles.avatarContainer, styles.avatarSecond]}>
          <View style={[styles.avatar, { backgroundColor: colors.card }]}>
            <FontAwesome name="user" size={40} color={colors.text} />
          </View>
          <View style={[styles.rankBadge, styles.rankSecond]}>
            <Text style={styles.rankText}>2</Text>
          </View>
        </View>
        <Text style={[styles.leaderName, { color: colors.text }]}>
          {leaderboardData.find(p => p.rank === 2)?.name}
        </Text>
        <Text style={[styles.bobaCount, { color: colors.secondaryText }]}>
          {leaderboardData.find(p => p.rank === 2)?.bobas} bobas
        </Text>
      </View>
    </View>
  );
};

const FeedCard = ({ item, colorScheme }: { item: typeof feedData[0], colorScheme: 'light' | 'dark' }) => {
  const colors = Colors[colorScheme];
  const router = useRouter();

  const handleProfilePress = () => {
    router.push(`/profile/${item.userId}`);
  };

  return (
    <View style={[styles.feedCard, { backgroundColor: colors.card }]}>
      <TouchableOpacity style={styles.feedCardLeft} onPress={handleProfilePress} activeOpacity={0.7}>
        <View style={[styles.feedAvatar, { backgroundColor: colors.background }]}>
          <FontAwesome name="user" size={30} color={colors.text} />
        </View>
        <View style={styles.feedInfo}>
          <Text style={[styles.feedUserName, { color: colors.text }]}>{item.userName}</Text>
          <Text style={[styles.feedTimestamp, { color: colors.secondaryText }]}>{item.timestamp}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.feedContent}>
        <View style={styles.feedDetails}>
          <Text style={[styles.visitedText, { color: colors.secondaryText }]}>
            Visited <Text style={{ color: colors.text, fontWeight: '600' }}>{item.shopName}</Text>
          </Text>
          <Text style={[styles.locationText, { color: colors.secondaryText }]}>
            in {item.location}
          </Text>

          <RatingEmojis rating={item.rating} />

          <Text style={[styles.drinkName, { color: Colors[colorScheme].accent }]}>
            {item.drinkName}
          </Text>
          <Text style={[styles.caption, { color: colors.secondaryText }]}>
            {item.caption}
          </Text>
        </View>

        <Image
          source={{ uri: item.drinkImage }}
          style={styles.drinkImage}
          resizeMode="cover"
        />
      </View>
    </View>
  );
};

export default function FeedScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <FontAwesome name="search" size={20} color={colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Add a friend"
            placeholderTextColor={colors.secondaryText}
          />
        </View>

        {/* Monthly Leaderboard */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Leaderboard</Text>
          <LeaderboardPodium colorScheme={colorScheme} />
        </View>

        {/* Feed */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Feed</Text>
          {feedData.map((item) => (
            <FeedCard key={item.id} item={item} colorScheme={colorScheme} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  // Podium styles
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginVertical: 20,
  },
  podiumPerson: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  firstPlace: {
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarFirst: {
    borderColor: '#EE961F',
  },
  avatarSecond: {
    borderColor: '#EE961F',
  },
  avatarThird: {
    borderColor: '#EE961F',
  },
  rankBadge: {
    position: 'absolute',
    bottom: -5,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankFirst: {
    backgroundColor: '#EE961F',
  },
  rankSecond: {
    backgroundColor: '#EE961F',
  },
  rankThird: {
    backgroundColor: '#EE961F',
  },
  rankText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  leaderName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  bobaCount: {
    fontSize: 14,
  },
  // Feed card styles
  feedCard: {
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  feedAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  feedInfo: {
    flex: 1,
  },
  feedUserName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  feedTimestamp: {
    fontSize: 14,
  },
  feedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  feedDetails: {
    flex: 1,
    marginRight: 15,
  },
  visitedText: {
    fontSize: 14,
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ratingEmoji: {
    fontSize: 20,
    marginRight: 8,
    opacity: 0.3,
  },
  selectedEmoji: {
    opacity: 1,
  },
  drinkName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  caption: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  drinkImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
});

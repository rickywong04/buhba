import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Colors from '../constants/Colors';
import { getBobaEntryById, updateBobaEntry } from '../utils/storage';

export default function EditBobaScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  const { entryId } = useLocalSearchParams<{ entryId: string }>();

  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [flavor, setFlavor] = useState('');
  const [price, setPrice] = useState('');
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [occasion, setOccasion] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestPermissions();
    loadEntry();
  }, []);

  const requestPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(cameraResult.granted);

    const galleryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryResult.granted);

    const locationResult = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(locationResult.granted);
  };

  const loadEntry = async () => {
    try {
      if (!entryId) {
        Alert.alert('Error', 'No entry ID provided');
        router.back();
        return;
      }

      const entry = await getBobaEntryById(entryId);
      if (!entry) {
        Alert.alert('Error', 'Entry not found');
        router.back();
        return;
      }

      setImageUri(entry.imageUri);
      setFlavor(entry.flavor);
      setPrice(entry.price.toString());
      setShopName(entry.shopName);
      setLocation(entry.location);
      setOccasion(entry.occasion || '');
      setRating(entry.rating || null);
      setLoading(false);
    } catch (error) {
      console.error('Error loading entry:', error);
      Alert.alert('Error', 'Failed to load entry');
      router.back();
    }
  };

  const takePicture = async () => {
    if (!cameraPermission) {
      Alert.alert('Permission Required', 'Please allow access to your camera');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);

        // Try to get location if permission granted
        if (locationPermission) {
          try {
            const location = await Location.getCurrentPositionAsync({});
            const address = await Location.reverseGeocodeAsync({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude
            });

            if (address && address[0]) {
              setLocation(`${address[0].city || ''}, ${address[0].region || ''}`);
            }
          } catch (error) {
            console.error('Error getting location:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const pickImage = async () => {
    if (!galleryPermission) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const saveChanges = async () => {
    if (!imageUri) {
      Alert.alert('Missing Image', 'Please take or select a photo of your boba drink');
      return;
    }

    if (!flavor) {
      Alert.alert('Missing Info', 'Please enter the flavor of your boba drink');
      return;
    }

    if (!price) {
      Alert.alert('Missing Info', 'Please enter the price of your boba drink');
      return;
    }

    if (!shopName) {
      Alert.alert('Missing Info', 'Please enter the shop name');
      return;
    }

    try {
      await updateBobaEntry(entryId!, {
        imageUri,
        flavor,
        price: parseFloat(price),
        shopName,
        location: location || 'Unknown',
        occasion,
        rating: rating || undefined,
      });

      Alert.alert(
        'Success',
        'Your boba drink has been updated!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error updating boba entry:', error);
      Alert.alert('Error', 'Failed to update your boba drink');
    }
  };

  const ratingEmojis = ['😞', '😐', '🙂', '😊'];

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Gradient Header with Teardrop */}
          <View style={styles.headerContainer}>
            <LinearGradient
              colors={['#5C4340', '#B8824A', '#E6A965']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientHeader}
            >
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                  <FontAwesome name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerLogo}>buhba</Text>
                <TouchableOpacity>
                  <FontAwesome name="user-circle-o" size={28} color="white" />
                </TouchableOpacity>
              </View>

              {/* Circular Image */}
              <View style={styles.imageSection}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.circularImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>No Image Selected</Text>
                  </View>
                )}
              </View>
            </LinearGradient>

            {/* Teardrop Wave */}
            <Svg
              height="60"
              width="100%"
              style={styles.wave}
              viewBox="0 0 400 60"
              preserveAspectRatio="none"
            >
              <Path
                d="M0,0 Q200,60 400,0 L400,60 L0,60 Z"
                fill={colors.background}
              />
            </Svg>
          </View>

          {/* Photo Buttons */}
          <View style={styles.photoButtons}>
            <TouchableOpacity style={[styles.photoButton, { backgroundColor: colors.card }]} onPress={takePicture}>
              <Text style={[styles.photoButtonText, { color: colors.text }]}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.photoButton, { backgroundColor: colors.card }]} onPress={pickImage}>
              <Text style={[styles.photoButtonText, { color: colors.text }]}>Choose Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Flavor */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Flavor</Text>
                <FontAwesome name="coffee" size={20} color={colors.text} />
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. Strawberry Matcha Latte"
                placeholderTextColor="#B0B0B0"
                value={flavor}
                onChangeText={setFlavor}
              />
            </View>

            {/* Price */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Price</Text>
                <FontAwesome name="credit-card" size={20} color={colors.text} />
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. $00.00"
                placeholderTextColor="#B0B0B0"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            {/* Store */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Store</Text>
                <FontAwesome name="shopping-cart" size={20} color={colors.text} />
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. Tsaocaa"
                placeholderTextColor="#B0B0B0"
                value={shopName}
                onChangeText={setShopName}
              />
            </View>

            {/* What's the occasion */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>What's the occasion?</Text>
                <FontAwesome name="comment-o" size={20} color={colors.text} />
              </View>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                placeholder="e.g. Celebrating that I passed my exam!"
                placeholderTextColor="#B0B0B0"
                value={occasion}
                onChangeText={setOccasion}
              />
            </View>

            {/* Rating */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.text }]}>Rating</Text>
                <FontAwesome name="pencil" size={20} color={colors.text} />
              </View>
              <View style={styles.ratingContainer}>
                {ratingEmojis.map((emoji, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setRating(index + 1)}
                    style={[
                      styles.emojiButton,
                      rating === index + 1 && styles.emojiButtonSelected,
                    ]}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primaryButton }]} onPress={saveChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  headerContainer: {
    position: 'relative',
    marginBottom: -30,
    width: '100%',
  },
  gradientHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLogo: {
    fontSize: 28,
    fontFamily: 'Jua_400Regular',
    color: 'white',
  },
  imageSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  circularImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'white',
  },
  imagePlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#B0B0B0',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginTop: 100,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
    paddingHorizontal: 20,
    marginTop: 40,
  },
  photoButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photoButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
  },
  emojiButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: '#EE961F',
    backgroundColor: '#FFF5E6',
  },
  emojiText: {
    fontSize: 28,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
});

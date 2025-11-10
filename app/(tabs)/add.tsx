import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
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
import Colors from '../../constants/Colors';
import { addBobaEntry } from '../../utils/storage';

export default function AddBobaScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();
  
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [galleryPermission, setGalleryPermission] = useState<boolean | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [flavor, setFlavor] = useState('');
  const [price, setPrice] = useState('');
  const [shopName, setShopName] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const requestPermissions = async () => {
    const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
    setCameraPermission(cameraResult.granted);
    
    const galleryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    setGalleryPermission(galleryResult.granted);
    
    const locationResult = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(locationResult.granted);
  };
  
  React.useEffect(() => {
    requestPermissions();
  }, []);

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
  
  const saveBobaEntry = async () => {
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
      await addBobaEntry({
        imageUri,
        flavor,
        price: parseFloat(price),
        shopName,
        location: location || 'Unknown',
        date: new Date().toISOString(),
        notes,
      });
      
      // Reset form
      setImageUri(null);
      setFlavor('');
      setPrice('');
      setShopName('');
      setLocation('');
      setNotes('');
      
      Alert.alert(
        'Success', 
        'Your boba drink has been saved!',
        [{ text: 'OK', onPress: () => router.push('/') }]
      );
    } catch (error) {
      console.error('Error saving boba entry:', error);
      Alert.alert('Error', 'Failed to save your boba drink');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: 120 }]}
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        
        <Text style={[styles.title, { color: colors.text }]}>Add New Boba</Text>
        
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.card }]}>
              <Text style={[styles.imagePlaceholderText, { color: colors.text }]}>
                No Image Selected
              </Text>
            </View>
          )}
          
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.secondaryButton }]}
              onPress={takePicture}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.secondaryButton }]}
              onPress={pickImage}
            >
              <Text style={[styles.buttonText, { color: colors.text }]}>Choose Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Flavor *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="e.g. Taro Milk Tea"
              placeholderTextColor={colors.secondaryText || '#999'}
              value={flavor}
              onChangeText={setFlavor}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Price *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="e.g. 5.99"
              placeholderTextColor={colors.secondaryText || '#999'}
              keyboardType="decimal-pad"
              value={price}
              onChangeText={setPrice}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Shop Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="e.g. Boba Guys"
              placeholderTextColor={colors.secondaryText || '#999'}
              value={shopName}
              onChangeText={setShopName}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="e.g. San Francisco, CA"
              placeholderTextColor={colors.secondaryText || '#999'}
              value={location}
              onChangeText={setLocation}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Notes</Text>
            <TextInput
              style={[styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
              placeholder="Any additional notes..."
              placeholderTextColor={colors.secondaryText || '#999'}
              multiline
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.saveButton, { backgroundColor: colors.primaryButton }]} 
            onPress={saveBobaEntry}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 60,
    paddingBottom: 120,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    gap: 10,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  textArea: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    textAlignVertical: 'top',
    minHeight: 100,
  },
  saveButton: {
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  button: {
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
}); 
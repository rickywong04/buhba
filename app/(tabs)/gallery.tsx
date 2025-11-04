import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import Colors from '../../constants/Colors';
import { BobaEntry, deleteBobaEntry, getAllBobaEntries } from '../../utils/storage';

export default function GalleryScreen() {
  const colorScheme = useColorScheme() || 'light';
  const colors = Colors[colorScheme];
  const isFocused = useIsFocused();
  const [bobaEntries, setBobaEntries] = useState<BobaEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<BobaEntry | null>(null);

  useEffect(() => {
    if (isFocused) {
      loadEntries();
    }
  }, [isFocused]);

  const loadEntries = async () => {
    try {
      const entries = await getAllBobaEntries();
      setBobaEntries(entries);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Boba',
      'Are you sure you want to delete this boba entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteBobaEntry(id);
              setSelectedEntry(null);
              loadEntries();
            } catch (error) {
              console.error('Error deleting entry:', error);
              Alert.alert('Error', 'Failed to delete entry');
            }
          },
        },
      ]
    );
  };

  const renderDetailModal = () => {
    if (!selectedEntry) return null;

    return (
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setSelectedEntry(null)}
      >
        <View 
          style={[styles.modalContent, { backgroundColor: colors.card }]}
          onStartShouldSetResponder={() => true}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => setSelectedEntry(null)}
          >
            <FontAwesome name="times" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: selectedEntry.imageUri }} 
            style={styles.modalImage}
          />
          
          <View style={styles.modalDetails}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {selectedEntry.flavor}
            </Text>
            
            <View style={styles.detailRow}>
              <FontAwesome name="map-marker" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {selectedEntry.shopName}, {selectedEntry.location}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <FontAwesome name="calendar" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {formatDate(selectedEntry.date)}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <FontAwesome name="dollar" size={16} color={colors.text} />
              <Text style={[styles.detailText, { color: colors.text }]}>
                {formatPrice(selectedEntry.price)}
              </Text>
            </View>
            
            {selectedEntry.notes ? (
              <View style={styles.notesContainer}>
                <Text style={[styles.notesLabel, { color: colors.text }]}>Notes:</Text>
                <Text style={[styles.notesText, { color: colors.text }]}>
                  {selectedEntry.notes}
                </Text>
              </View>
            ) : null}
            
            <TouchableOpacity 
              style={[styles.deleteButton, { backgroundColor: colors.danger }]} 
              onPress={() => handleDelete(selectedEntry.id)}
            >
              <FontAwesome name="trash" size={16} color="#fff" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      <Text style={[styles.title, { color: colors.text }]}>Your Boba Collection</Text>
      
      {bobaEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Your boba gallery is empty. Add some boba drinks to see them here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={bobaEntries}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.gridItem, { backgroundColor: colors.card }]}
              onPress={() => setSelectedEntry(item)}
            >
              <Image source={{ uri: item.imageUri }} style={styles.gridImage} />
              <View style={styles.gridInfo}>
                <Text 
                  style={[styles.gridTitle, { color: colors.text }]} 
                  numberOfLines={1}
                >
                  {item.flavor}
                </Text>
                <Text 
                  style={[styles.gridSubtitle, { color: colors.text }]} 
                  numberOfLines={1}
                >
                  {item.shopName}
                </Text>
                <Text style={[styles.gridDate, { color: colors.text }]}>
                  {formatDate(item.date)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      
      {renderDetailModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    paddingBottom: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  gridContainer: {
    paddingBottom: 20,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 0,
    maxWidth: '48%',
  },
  gridImage: {
    width: '100%',
    height: 150,
  },
  gridInfo: {
    padding: 10,
    minWidth: 0,
  },
  gridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  gridSubtitle: {
    fontSize: 12,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  gridDate: {
    fontSize: 10,
    flexWrap: 'wrap',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 5,
  },
  modalImage: {
    width: '100%',
    height: 250,
  },
  modalDetails: {
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  notesContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    flexWrap: 'wrap',
  },
  deleteButton: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 
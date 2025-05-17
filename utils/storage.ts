import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BobaEntry {
  id: string;
  imageUri: string;
  flavor: string;
  price: number;
  shopName: string;
  location: string;
  date: string;
  notes?: string;
}

const STORAGE_KEYS = {
  BOBA_ENTRIES: 'boba_entries',
};

// Initialize the storage with empty data if needed
export const initStorage = async (): Promise<void> => {
  const entries = await AsyncStorage.getItem(STORAGE_KEYS.BOBA_ENTRIES);
  if (!entries) {
    await AsyncStorage.setItem(STORAGE_KEYS.BOBA_ENTRIES, JSON.stringify([]));
  }
};

// Add a new boba entry
export const addBobaEntry = async (entry: Omit<BobaEntry, 'id'>): Promise<BobaEntry> => {
  const entries = await getAllBobaEntries();
  const newEntry = {
    ...entry,
    id: Date.now().toString(),
  };
  
  entries.unshift(newEntry); // Add to beginning for chronological order
  await AsyncStorage.setItem(STORAGE_KEYS.BOBA_ENTRIES, JSON.stringify(entries));
  return newEntry;
};

// Get all boba entries
export const getAllBobaEntries = async (): Promise<BobaEntry[]> => {
  const entries = await AsyncStorage.getItem(STORAGE_KEYS.BOBA_ENTRIES);
  return entries ? JSON.parse(entries) : [];
};

// Get boba entry by ID
export const getBobaEntryById = async (id: string): Promise<BobaEntry | null> => {
  const entries = await getAllBobaEntries();
  return entries.find(entry => entry.id === id) || null;
};

// Delete a boba entry
export const deleteBobaEntry = async (id: string): Promise<void> => {
  const entries = await getAllBobaEntries();
  const updatedEntries = entries.filter(entry => entry.id !== id);
  await AsyncStorage.setItem(STORAGE_KEYS.BOBA_ENTRIES, JSON.stringify(updatedEntries));
};

// Get total spent on boba
export const getTotalSpent = async (): Promise<number> => {
  const entries = await getAllBobaEntries();
  return entries.reduce((total, entry) => total + entry.price, 0);
};

// Get count of boba entries
export const getBobaCount = async (): Promise<number> => {
  const entries = await getAllBobaEntries();
  return entries.length;
};

// Get most frequent flavor
export const getMostFrequentFlavor = async (): Promise<{ flavor: string; count: number }> => {
  const entries = await getAllBobaEntries();
  const flavorCounts: Record<string, number> = {};
  
  entries.forEach(entry => {
    flavorCounts[entry.flavor] = (flavorCounts[entry.flavor] || 0) + 1;
  });
  
  let mostFrequentFlavor = '';
  let highestCount = 0;
  
  Object.entries(flavorCounts).forEach(([flavor, count]) => {
    if (count > highestCount) {
      mostFrequentFlavor = flavor;
      highestCount = count;
    }
  });
  
  return { flavor: mostFrequentFlavor || 'None', count: highestCount };
}; 
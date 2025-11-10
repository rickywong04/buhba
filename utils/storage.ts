import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BobaEntry {
  id: string;
  imageUri: string;
  flavor: string;
  price: number;
  shopName: string;
  location: string;
  date: string;
  occasion?: string;
  rating?: number; // 1-4 (sad to happy)
  notes?: string; // Keep for backwards compatibility
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

// Helper to normalize flavor names (case-insensitive, trimmed)
const normalizeFlavor = (flavor: string): string => {
  return flavor.trim().toLowerCase();
};

// Get most frequent flavor (case-insensitive)
export const getMostFrequentFlavor = async (): Promise<{ flavor: string; count: number }> => {
  const entries = await getAllBobaEntries();
  const flavorCounts: Record<string, { count: number; originalName: string }> = {};

  entries.forEach(entry => {
    const normalized = normalizeFlavor(entry.flavor);
    if (!flavorCounts[normalized]) {
      flavorCounts[normalized] = { count: 0, originalName: entry.flavor };
    }
    flavorCounts[normalized].count++;
  });

  let mostFrequentFlavor = '';
  let highestCount = 0;

  Object.entries(flavorCounts).forEach(([_, data]) => {
    if (data.count > highestCount) {
      mostFrequentFlavor = data.originalName;
      highestCount = data.count;
    }
  });

  return { flavor: mostFrequentFlavor || 'None', count: highestCount };
};

// Update a boba entry
export const updateBobaEntry = async (id: string, updates: Partial<Omit<BobaEntry, 'id'>>): Promise<BobaEntry | null> => {
  const entries = await getAllBobaEntries();
  const index = entries.findIndex(entry => entry.id === id);

  if (index === -1) {
    return null;
  }

  entries[index] = { ...entries[index], ...updates };
  await AsyncStorage.setItem(STORAGE_KEYS.BOBA_ENTRIES, JSON.stringify(entries));
  return entries[index];
}; 
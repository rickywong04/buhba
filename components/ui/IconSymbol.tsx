// Fallback for using MaterialIcons on Android and web.

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
}

export function IconSymbol({ name, size = 24, color = 'black' }: IconSymbolProps) {
  return (
    <View>
      <FontAwesome name="star" size={size} color={color} />
    </View>
  );
}

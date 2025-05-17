import { View, type ViewProps, useColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const colorScheme = useColorScheme() || 'light';
  const backgroundColor = lightColor && darkColor
    ? colorScheme === 'dark' ? darkColor : lightColor
    : Colors[colorScheme].background;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

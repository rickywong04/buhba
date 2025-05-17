/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

// Source: https://coolors.co/palette/f8edeb-fcd5ce-fec5bb-fad2e1-e0c1f4-d6e2e9-bee1e6-cddafd

const tintColorLight = '#A878DC'; // Lavender - boba theme
const tintColorDark = '#D9B8FF';  // Light lavender for dark mode

export default {
  light: {
    text: '#333333',
    background: '#F8EDEB', // Soft pink
    tint: tintColorLight,
    tabIconDefault: '#cccccc',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    separator: '#EEEEEE',
    primaryButton: '#A878DC', // Lavender
    secondaryButton: '#BEE1E6', // Light blue
    accent1: '#FAD2E1', // Pink
    accent2: '#FEC5BB', // Peach
    accent3: '#E0C1F4', // Light purple
    danger: '#FF6B6B', // Red
  },
  dark: {
    text: '#F8EDEB',
    background: '#222222',
    tint: tintColorDark,
    tabIconDefault: '#777777',
    tabIconSelected: tintColorDark,
    card: '#333333',
    separator: '#444444',
    primaryButton: tintColorDark,
    secondaryButton: '#7ca5b8', // Darker blue
    accent1: '#c289a5', // Darker pink
    accent2: '#c28c7c', // Darker peach
    accent3: '#a878dc', // Darker purple
    danger: '#FF6B6B', // Red
  },
};

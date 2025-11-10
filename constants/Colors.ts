/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * Branding colors: Inter font for text, Jua font for logo
 */

// Branding colors
const primaryText = '#583B39'; // Primary Text (dark brown)
const secondaryText = '#85695D'; // Secondary Text (lighter brown)
const primaryColor = '#583B39'; // Primary Color (dark brown)
const secondaryColor = '#FAF0E2'; // Secondary Color (cream/beige)
const accentColor = '#EE961F'; // Accent Color (orange)

export default {
  light: {
    text: primaryText,
    secondaryText: secondaryText,
    background: '#FFFFFF', // White background
    tint: accentColor,
    tabIconDefault: '#CCCCCC',
    tabIconSelected: accentColor,
    card: secondaryColor, // Cream/beige cards
    separator: '#E0E0E0',
    primaryButton: accentColor, // Orange
    secondaryButton: secondaryColor, // Cream/beige
    primaryColor: primaryColor, // Dark brown
    secondaryColor: secondaryColor, // Cream/beige
    accent: accentColor, // Orange
    danger: '#FF6B6B', // Red
  },
  dark: {
    text: '#FAF0E2',
    secondaryText: '#C4B5A8',
    background: '#1A1410',
    tint: accentColor,
    tabIconDefault: '#777777',
    tabIconSelected: accentColor,
    card: '#2D2520',
    separator: '#3A3330',
    primaryButton: accentColor,
    secondaryButton: '#3A3330',
    primaryColor: '#6B4F47',
    secondaryColor: '#2D2520',
    accent: accentColor,
    danger: '#FF6B6B',
  },
};

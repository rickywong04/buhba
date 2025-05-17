import type { PropsWithChildren, ReactElement } from 'react';
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { ThemedView } from './ThemedView';

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const colorScheme = useColorScheme() || 'light';

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        {headerImage && (
          <ThemedView 
            style={styles.header}
            lightColor={headerBackgroundColor?.light}
            darkColor={headerBackgroundColor?.dark}
          >
            {headerImage}
          </ThemedView>
        )}
        <ThemedView style={styles.content}>{children}</ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});

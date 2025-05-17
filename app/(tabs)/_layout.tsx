import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Colors from '../../constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme() || 'light';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#604A44', // Brown color from the image
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          position: 'absolute',
          borderRadius: 40,
          marginHorizontal: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
      }}>
      <Tabs.Screen
        name="friends"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#CCCCCC',
        }}
        listeners={{
          tabPress: (e) => {
            // Prevent default action for now - Friends tab not implemented yet
            e.preventDefault();
          },
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          tabBarActiveTintColor: '#E49E4C', // Active color from the image
          tabBarInactiveTintColor: '#CCCCCC',
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add Boba',
          tabBarIcon: ({ color }) => (
            <View style={styles.addButton}>
              <FontAwesome name="plus" size={24} color="white" />
            </View>
          ),
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'white',
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <TabBarIcon name="th" color={color} />,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#CCCCCC',
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: '#CCCCCC',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E49E4C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 5,
  },
});

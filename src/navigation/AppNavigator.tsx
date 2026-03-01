import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * AppNavigator - Placeholder for future tab-based navigation.
 * 
 * Currently unused. The app uses MainNavigator directly from App.tsx.
 * This will be implemented when the full tab navigation is built out
 * (GameStream, Teams, Players, Profile tabs).
 */
export default function AppNavigator() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>AppNavigator placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
});

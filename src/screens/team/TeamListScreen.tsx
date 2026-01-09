import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme, spacing } from '../../config/theme';

const TeamListScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Team List Screen - Coming Soon</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});

export default TeamListScreen;

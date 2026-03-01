import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = '#FF6B35',
  fullScreen = false,
}) => {
  return (
    <View style={fullScreen ? styles.fullScreen : styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A1929',
  },
});

export default Loading;

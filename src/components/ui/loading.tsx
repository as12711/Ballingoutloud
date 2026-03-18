import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = '#FF6B35',
  fullScreen = false,
  className,
}) => {
  return (
    <View
      className={cn(
        fullScreen ? 'flex-1 items-center justify-center bg-background' : 'items-center justify-center p-5',
        className,
      )}
    >
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export { Loading };
export default Loading;

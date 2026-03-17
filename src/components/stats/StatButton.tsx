import React from 'react';
import { View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

type StatVariant = 'made' | 'missed' | 'action' | 'negative';

interface StatButtonProps {
  label: string;
  value?: number | string;
  onPress: () => void;
  variant?: StatVariant;
  size?: 'small' | 'medium' | 'large';
}

const VARIANT_MAP: Record<StatVariant, 'default' | 'outline' | 'secondary' | 'destructive'> = {
  made: 'default',
  missed: 'outline',
  action: 'secondary',
  negative: 'destructive',
};

const StatButton: React.FC<StatButtonProps> = ({
  label,
  value,
  onPress,
  variant = 'made',
  size = 'medium',
}) => {
  const buttonVariant = VARIANT_MAP[variant];

  return (
    <Button
      variant={buttonVariant}
      onPress={onPress}
      className="min-w-[72px] h-12 m-1 flex-col gap-0"
    >
      <Text className="text-xs font-semibold">{label}</Text>
      {value !== undefined && (
        <Text className="text-lg font-bold">{value}</Text>
      )}
    </Button>
  );
};

export default StatButton;

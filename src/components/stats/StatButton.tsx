import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme, spacing } from '../../config/theme';

interface StatButtonProps {
  label: string;
  value?: number | string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

const StatButton: React.FC<StatButtonProps> = ({
  label,
  value,
  onPress,
  variant = 'primary',
  size = 'medium',
}) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' && styles.primaryButton,
    variant === 'secondary' && styles.secondaryButton,
    size === 'small' && styles.smallButton,
    size === 'medium' && styles.mediumButton,
    size === 'large' && styles.largeButton,
  ];

  const textStyle = [
    styles.label,
    variant === 'primary' && styles.primaryText,
    variant === 'secondary' && styles.secondaryText,
  ];

  const valueStyle = [
    styles.value,
    variant === 'primary' && styles.primaryValueText,
    variant === 'secondary' && styles.secondaryValueText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.7}>
      <Text style={textStyle}>{label}</Text>
      {value !== undefined && <Text style={valueStyle}>{value}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.xs,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  secondaryButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  smallButton: {
    minWidth: 80,
    minHeight: 80,
  },
  mediumButton: {
    minWidth: 100,
    minHeight: 100,
  },
  largeButton: {
    minWidth: 120,
    minHeight: 120,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: theme.colors.primary,
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  primaryValueText: {
    color: '#FFFFFF',
  },
  secondaryValueText: {
    color: theme.colors.primary,
  },
});

export default StatButton;

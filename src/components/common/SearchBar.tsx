import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { spacing } from '../../config/theme';

// Court Vision colors
const courtColors = {
  cardBg: '#111B27',
  textMuted: '#6B7280',
  white: '#FFFFFF',
  cardBorder: 'rgba(255, 255, 255, 0.06)',
};

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  value?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search...',
  onSearch,
  value: controlledValue,
}) => {
  const [localValue, setLocalValue] = useState('');

  const value = controlledValue !== undefined ? controlledValue : localValue;

  const handleChangeText = (text: string) => {
    if (controlledValue === undefined) {
      setLocalValue(text);
    }
    onSearch(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={courtColors.textMuted}
        value={value}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
  },
  input: {
    backgroundColor: courtColors.cardBg,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: courtColors.white,
    borderWidth: 1,
    borderColor: courtColors.cardBorder,
  },
});

export default SearchBar;

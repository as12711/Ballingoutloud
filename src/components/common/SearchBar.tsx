import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { theme, spacing } from '../../config/theme';

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
        placeholderTextColor={theme.colors.textSecondary}
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
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});

export default SearchBar;

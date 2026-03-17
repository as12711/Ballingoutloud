import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';

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
    <View className="my-2">
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={handleChangeText}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

export default SearchBar;

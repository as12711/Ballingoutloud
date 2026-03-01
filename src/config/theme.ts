import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976d2',
    secondary: '#dc004e',
    background: '#ffffff',
    surface: '#f5f5f5',
    error: '#b00020',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#000000',
    onSurface: '#000000',
    onError: '#ffffff',
    text: '#000000',
    textSecondary: '#666666',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#90caf9',
    secondary: '#f48fb1',
    background: '#121212',
    surface: '#1e1e1e',
    error: '#cf6679',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#ffffff',
    onSurface: '#ffffff',
    onError: '#000000',
    text: '#ffffff',
    textSecondary: '#999999',
  },
};

// Default theme export for backward compatibility
export const theme = lightTheme;

// Spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export type AppTheme = typeof lightTheme;

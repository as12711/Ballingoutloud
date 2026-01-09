import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import MainNavigator from './src/navigation/MainNavigator';
import { lightTheme } from './src/config/theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={lightTheme}>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

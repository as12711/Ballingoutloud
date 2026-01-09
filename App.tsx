import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { lightTheme } from './src/config/theme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={lightTheme}>
          <AppNavigator />
        </PaperProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}

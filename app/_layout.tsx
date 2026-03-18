import "../global.css";
import { Stack } from "expo-router";
import { Provider as ReduxProvider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store } from "../src/store/store";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#FFFFFF" },
            headerTintColor: "#09090B",
            headerTitleStyle: { fontWeight: "600" },
            contentStyle: { backgroundColor: "#FFFFFF" },
            headerShadowVisible: false,
          }}
        />
      </QueryClientProvider>
    </ReduxProvider>
  );
}

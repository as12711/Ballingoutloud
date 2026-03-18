import { Platform } from "react-native";
import { Redirect } from "expo-router";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "../src/navigation/MainNavigator";

export default function Index() {
  // On web, use Expo Router file-based routes
  if (Platform.OS === "web") {
    return <Redirect href="/games" />;
  }

  // On native, use the existing React Navigation stack
  // which has all screens and navigation.navigate() calls wired up
  return (
    <NavigationContainer independent>
      <MainNavigator />
    </NavigationContainer>
  );
}

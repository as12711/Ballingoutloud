import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import LiveStatScreen from "../../../src/screens/game/LiveStatScreen";

export default function LiveStatPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1 }}>
      <LiveStatScreen route={{ params: { gameId: id } } as any} />
    </View>
  );
}

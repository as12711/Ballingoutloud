import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import GameDetailScreen from "../../../src/screens/game/GameDetailScreen";

export default function GameDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1 }}>
      <GameDetailScreen route={{ params: { gameId: id } } as any} />
    </View>
  );
}

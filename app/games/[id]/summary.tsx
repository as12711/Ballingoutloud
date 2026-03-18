import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import GameSummaryScreen from "../../../src/screens/game/GameSummaryScreen";

export default function GameSummaryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1 }}>
      <GameSummaryScreen route={{ params: { gameId: id } } as any} />
    </View>
  );
}

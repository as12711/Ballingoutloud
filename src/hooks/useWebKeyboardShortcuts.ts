import { useEffect } from "react";
import { Platform } from "react-native";

// Keyboard shortcut mapping for web LiveStat
const SHORTCUTS: Record<string, { event: string; shift?: string }> = {
  "2": { event: "2PT_FGM", shift: "2PT_FGA" },
  "3": { event: "3PT_FGM", shift: "3PT_FGA" },
  f: { event: "FT_FGM", shift: "FT_FGA" },
  r: { event: "REBOUND" },
  a: { event: "ASSIST" },
  b: { event: "BLOCK" },
  s: { event: "STEAL" },
  t: { event: "TURNOVER" },
  o: { event: "FOUL" },
  u: { event: "UNDO" },
};

export function useWebKeyboardShortcuts(
  gameId: string,
  onStatEvent?: (event: string) => void,
  onUndo?: () => void
) {
  useEffect(() => {
    if (Platform.OS !== "web") return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't capture if typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      const shortcut = SHORTCUTS[key];

      if (!shortcut) return;

      e.preventDefault();

      if (e.shiftKey && shortcut.shift) {
        onStatEvent?.(shortcut.shift);
      } else {
        if (shortcut.event === "UNDO") {
          onUndo?.();
        } else {
          onStatEvent?.(shortcut.event);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [gameId, onStatEvent, onUndo]);
}

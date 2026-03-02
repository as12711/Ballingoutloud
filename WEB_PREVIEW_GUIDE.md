# Web Preview Guide

## Interactive Stat Tracker (Recommended)

The standalone HTML stat tracker at `web/index.html` provides full functionality in any browser — no Expo or Metro bundler needed.

### Quick Start

```bash
# Option 1: Open directly in browser
open web/index.html        # macOS
xdg-open web/index.html    # Linux
start web/index.html        # Windows

# Option 2: Serve with any static server
npx serve web
```

### Features

The web stat tracker connects directly to Supabase and provides:

- **Games tab** — View all games, create new games, click live games to track stats
- **Teams tab** — View/create teams
- **Players tab** — View/add players to teams
- **Live Tracker** — Full stat tracking with:
  - Player selector (both teams' rosters)
  - Shooting buttons (2PT FGA/FGM, 3PT FGA/FGM, FT ATT/MADE)
  - Action buttons (REB, AST, STL, BLK, TO, FOUL)
  - Auto score calculation from made shots
  - Quarter management
  - Undo last action (reverses stat event, game_stats, and score)
  - Live event log
  - Box score view
  - End game (marks as completed)
- **Box Score modal** — Full player-by-player stats table for any game

All data persists to Supabase and will appear in the Expo mobile app.

---

## Expo Web Preview (via Metro)

The Expo app can also run in a browser via Metro bundler.

### Start Web Server

```bash
npm run web
```

Opens at `http://localhost:8081`.

### Initial Route Behavior

- **Default**: Opens to `GameStream` screen (game list)
- **GameSummary preview**: Set `EXPO_PUBLIC_TEST_GAME_ID` in `.env` to a valid game UUID, and the web dev build will open directly to the Box Score screen for that game

### Environment Variables

```env
EXPO_PUBLIC_SUPABASE_URL=https://alniygpluvshxzjoojao.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_TEST_GAME_ID=          # Optional: UUID from games table
```

### Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Blank white screen | No games in database | Use `web/index.html` to create teams, players, and games first |
| "No games found" on GameStream | Database is empty or filter returns nothing | Create games via the web tracker or Supabase dashboard |
| GameSummary shows error | `EXPO_PUBLIC_TEST_GAME_ID` is invalid or unset | Set it to a real game UUID that has `game_stats` data |
| Metro won't start | Port 8081 in use | `fuser -k 8081/tcp` or use `--port 8082` |

### Limitations on Web

- `SafeAreaView` renders as a plain `View`
- Native animations may be simplified
- Push notifications not available
- Some gesture handlers may not work

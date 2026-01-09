# Web Preview Guide - Game Summary Screen

## Quick Start

To preview the Game Summary Screen in your browser:

### 1. Install Dependencies (Already Done ✅)
```bash
npm install react-native-web @expo/metro-runtime react-dom --legacy-peer-deps
```

### 2. Set Up Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
EXPO_PUBLIC_TEST_GAME_ID=your_actual_game_id_here
```

**Note**: For preview with real data, you'll need:
- A Supabase database with game data
- A valid `gameId` from your `games` table
- Player stats data in the `game_stats` table

### 3. Start Web Server
```bash
npm run web
```

This will:
- Start the Expo development server
- Automatically open your browser at `http://localhost:8081`
- Show the Game Summary Screen (set as initial route for web preview)

### 4. Preview the UI

The screen will load with:
- **Loading State**: Shows a spinner while fetching data
- **Error State**: If gameId is invalid or data doesn't exist, shows error with retry button
- **Success State**: Shows complete box score with:
  - Team headers with names and scores
  - Team totals (points, rebounds, assists, fouls)
  - Individual player statistics

## Using a Real Game ID

### Option 1: Environment Variable (Recommended)
1. Get a game ID from your Supabase dashboard:
   - Go to Table Editor → `games` table
   - Copy a game `id` (UUID format)
2. Add to `.env` file:
   ```env
   EXPO_PUBLIC_TEST_GAME_ID=your-actual-game-uuid-here
   ```
3. Restart the web server

### Option 2: Update Code Directly
1. Open `src/navigation/MainNavigator.tsx`
2. Find the `testGameId` constant (around line 35)
3. Replace `'test-game-id-123'` with your actual game ID
4. Restart the web server

## Troubleshooting

### "Failed to load game summary" Error
- **Cause**: Invalid gameId or no data in database
- **Solution**: 
  1. Verify gameId exists in your `games` table
  2. Check that `game_stats` table has data for that game
  3. Ensure Supabase environment variables are set correctly

### Blank Screen / Loading Forever
- **Cause**: Supabase connection issue or missing environment variables
- **Solution**:
  1. Check `.env` file has correct Supabase credentials
  2. Verify Supabase project is running
  3. Check browser console for errors (F12 → Console)

### Components Not Rendering
- **Cause**: Missing data or transformation errors
- **Solution**:
  1. Check browser console for errors
  2. Verify database schema matches expected structure
  3. Ensure `game_stats` has required fields (points, rebounds, assists, fouls)

## Preview Features

The web preview includes:
- ✅ Full UI rendering (dark theme)
- ✅ Loading states
- ✅ Error handling with retry
- ✅ Refresh functionality
- ✅ Responsive layout
- ⚠️ Some native features may be limited (e.g., SafeAreaView on web)

## Development Tips

1. **Browser DevTools**: Use F12 to inspect elements and see console logs
2. **Hot Reload**: Changes to components will auto-refresh
3. **Network Tab**: Check API calls to Supabase in Network tab
4. **React DevTools**: Install React DevTools extension for component inspection

## Navigation

From the Game Summary Screen:
- **Back Button**: Returns to previous screen (or home if initial route)
- **Refresh Button**: Reloads game data from Supabase

To navigate from code:
```tsx
navigation.navigate('GameSummary', { gameId: 'your-game-id' });
```

## Production Notes

When deploying:
- Remove the `initialRouteName` logic that defaults to GameSummary for web
- Ensure proper authentication/navigation flow
- GameSummary should be accessed via navigation from other screens

---

**Ready to Preview?** Run `npm run web` and open http://localhost:8081 in your browser! 🚀

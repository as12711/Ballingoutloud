# Balling Out Loud - Setup Guide

## Getting Started with GitHub Copilot & Cursor

This guide will walk you through setting up the entire project from scratch.

## Prerequisites

Before you begin, make sure you have:

- Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- npm or yarn
- Git
- GitHub account
- Supabase account (free tier) - [Sign up here](https://supabase.com)
- iOS Simulator (Mac) or Android Studio (Windows/Mac/Linux)
- VS Code with GitHub Copilot extension OR Cursor IDE

## Step 1: Initialize the Project

### Create Expo App

```bash
# Navigate to your projects directory
cd ~/projects

# Create new Expo app
npx create-expo-app balling-out-loud --template blank-typescript

# Navigate into project
cd balling-out-loud

# Open in your editor
code .  # for VS Code
# OR
cursor . # for Cursor
```

## Step 2: Install Dependencies

```bash
# Core dependencies
npm install @supabase/supabase-js
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install react-native-paper
npm install @reduxjs/toolkit react-redux
npm install @tanstack/react-query
npm install react-hook-form
npm install date-fns
npm install expo-image-picker expo-document-picker

# Development dependencies
npm install --save-dev @types/react @types/react-native
npm install --save-dev eslint prettier
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## Step 3: Set Up Supabase

### 3.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Create a new project:
   - Project name: `balling-out-loud`
   - Database password: (generate and save securely)
   - Region: Choose closest to you

### 3.2 Run Database Migration

1. In Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase_migration.sql` (provided in framework files)
3. Paste into SQL Editor and click "Run"
4. Wait for all tables to be created

### 3.3 Get API Keys

1. In Supabase dashboard, go to Settings > API
2. Copy the following:
   - Project URL
   - `anon` public key

## Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important**: Add `.env` to your `.gitignore`:

```bash
echo ".env" >> .gitignore
```

## Step 5: Create Project Structure

```bash
# Create directory structure
mkdir -p src/{api,components/{common,game,stats,player},screens/{auth,game,team,player,profile},navigation,store/slices,hooks,utils,types,config}
mkdir -p assets/{images,fonts,icons}

# Create placeholder files (Copilot will help fill these in)
touch src/config/supabase.ts
touch src/config/theme.ts
touch src/types/index.ts
touch src/store/store.ts
touch src/navigation/AppNavigator.tsx
```

## Step 6: Configure Supabase Client

Create `src/config/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

Update `app.config.js`:

```javascript
export default {
  expo: {
    name: "Balling Out Loud",
    slug: "balling-out-loud",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
    // ... rest of config
  }
};
```

## Step 7: Using GitHub Copilot Effectively

### Copilot Best Practices

1. **Write descriptive comments first**:
   ```typescript
   // Create a function that fetches all games from Supabase
   // Filter by status and date range
   // Return sorted by scheduled_at ascending
   ```

2. **Use meaningful file names**: Copilot uses context from file names

3. **Keep functions focused**: One function, one purpose

4. **Use TypeScript types**: Copilot works better with types

### Example Copilot Workflow

```typescript
// src/api/games.ts

// Import supabase client
import { supabase } from '../config/supabase';
import { Game, GameWithTeams } from '../types';

// Function to fetch upcoming games
export const fetchUpcomingGames = async (): Promise<GameWithTeams[]> => {
  // [Copilot will suggest the rest]
```

## Step 8: Using Cursor for Complex Tasks

### When to Switch to Cursor

Use Cursor for:
- Multi-file refactoring
- Large component generation
- Codebase-wide changes
- Complex state management setup
- Navigation configuration

### Cursor Commands

In Cursor, use Cmd+K (Mac) or Ctrl+K (Windows) to open the AI panel:

```
Prompt examples:
"Create a Redux store with slices for auth, games, and stats"
"Set up React Navigation with nested navigators"
"Refactor this component to use React Query for data fetching"
"Add error handling and loading states to all API calls"
```

## Step 9: Development Workflow

### Daily Development Flow

1. **Morning**: Plan features, write component outlines
2. **Use Copilot**: Generate boilerplate, API calls, utilities
3. **Use Cursor**: Complex logic, refactoring, debugging
4. **Test**: Run on simulator/device
5. **Commit**: Push working code to GitHub

### Testing on Device

```bash
# Start development server
npx expo start

# Options will appear:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app for physical device
```

## Step 10: GitHub Repository Setup

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Balling Out Loud setup"

# Create GitHub repo and push
git remote add origin https://github.com/BallingOutLoud/stattrack.git
git branch -M main
git push -u origin main
```

## Development Phases Checklist

### Phase 1: Foundation
- [x] Complete project setup (Expo SDK 54, TypeScript, ESLint, Prettier)
- [x] Configure Supabase (client in `src/config/supabase.ts`, env vars)
- [x] Create database schema (7 tables with RLS, triggers, indexes)
- [x] Set up authentication flow (Login, SignUp, Onboarding screens + authSlice)
- [x] Basic navigation structure (Stack navigator with 12 screens)
- [x] Theme configuration (Court Vision dark theme + light/dark Paper themes)

### Phase 2: Core UI
- [x] Game Stream screen (live Supabase query, filter tabs, search, pull-to-refresh)
- [x] Game Detail screen (real data, scoreboard, navigate to live stats/box score)
- [x] Game Summary / Box Score screen (multi-table aggregation, team sections, player rows)
- [x] Team List screen (real Supabase fetch, search, animated cards)
- [ ] Team Detail screen (stub — "Coming Soon")
- [ ] Create Team screen (stub — "Coming Soon")
- [x] Player List screen (real Supabase fetch, position filter, search)
- [x] Player Detail screen (real player data, hero section, stats display)
- [ ] Create Player screen (stub — "Coming Soon")
- [x] Profile screen (real user data, role badge, sign out)
- [x] Settings screen (full UI, toggles — no persistence yet)
- [x] Interactive web stat tracker (`web/index.html` — full CRUD + live tracking)

### Phase 3: Stat Tracking
- [x] Live stat tracking interface (stat buttons for all event types)
- [x] Stat button interactions (records to `stat_events` + updates `game_stats`)
- [x] Score updates (auto-calculates from made shots, syncs to `games` table)
- [x] Quarter management (increment/decrement, persisted to DB)
- [x] Undo functionality (reverses last stat event + game_stats + score)
- [ ] Player selection modal in mobile app (LiveStatScreen has no selector — web tracker does)
- [ ] Free throw buttons in mobile LiveStatScreen (schema supports it, buttons missing)

### Phase 4: Data & Real-time
- [x] Connect all API endpoints (auth, games, teams, players, stats — all wired to Supabase)
- [x] `useRealtime` hook coded (subscribes to `games` UPDATE + `stat_events` INSERT)
- [ ] Wire `useRealtime` into screens (hook exists but NO screen imports it)
- [ ] Add offline support
- [ ] Auth state listener (`onAuthStateChange` not implemented)
- [x] Error handling (try/catch in all async thunks, error states in screens)

### Phase 5: Polish
- [x] UI refinements (Court Vision dark theme across all screens)
- [ ] Performance optimization (React.memo, FlatList virtualization)
- [x] Add animations (ProfileScreen, OnboardingScreen, TeamListScreen, PlayerListScreen)
- [ ] User feedback (haptic feedback, sound effects)
- [ ] Bug fixes: SignUp role not sent to API, fake stats on Team/Player lists, `types/index.ts` legacy conflicts

## Common Issues & Solutions

### Issue: Expo won't start
```bash
# Clear cache and restart
npx expo start --clear
```

### Issue: Supabase connection errors
- Check `.env` file has correct values
- Verify Supabase project is running
- Check network connection

### Issue: TypeScript errors
```bash
# Regenerate TypeScript declarations
npx expo customize tsconfig.json
```

### Issue: iOS build errors
```bash
# Clean and reinstall pods (Mac only)
cd ios
pod deintegrate
pod install
cd ..
```

## Useful Commands

```bash
# Start development server
npx expo start

# Run on iOS
npx expo run:ios

# Run on Android
npx expo run:android

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# Build for production
eas build --platform ios
eas build --platform android
```

## Resources

- **Expo Docs**: https://docs.expo.dev
- **React Navigation**: https://reactnavigation.org
- **Supabase Docs**: https://supabase.com/docs
- **GitHub Copilot Tips**: https://github.com/features/copilot
- **Cursor AI Docs**: https://cursor.sh/docs

## Next Steps

1. Copy the provided component files into your project
2. Start with authentication flow
3. Build out the game stream feed
4. Implement stat tracking
5. Test thoroughly on real devices

## Support & Community

- GitHub Issues: Report bugs and request features
- Discord: Join our community (link TBD)
- Email: support@ballingoutloud.com

---

**Remember**: Take it one feature at a time. Use Copilot for speed, Cursor for complexity, and always test on real devices frequently!

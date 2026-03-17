# StatTrack shadcn Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship current app to TestFlight, then redesign UI with react-native-reusables (shadcn for RN), then rebuild web tracker as Expo Web routes.

**Architecture:** Three sequential phases. Phase 1 fixes bundle ID and deploys via EAS. Phase 2 replaces React Native Paper with NativeWind + react-native-reusables using shadcn's neutral theme. Phase 3 adds Expo Router web routes for 4 stat-tracking screens with keyboard shortcuts.

**Tech Stack:** Expo SDK 54, NativeWind 4, react-native-reusables, Tailwind CSS 3, Expo Router (web), class-variance-authority, clsx, tailwind-merge

---

## Phase 1: TestFlight Deployment

### Task 1: Fix Bundle ID Mismatch

**Files:**
- Modify: `app.config.js:16` (ios.bundleIdentifier)
- Modify: `app.config.js:31` (android.package)

**Step 1: Update iOS bundle identifier**

In `app.config.js`, change line 16:
```javascript
// FROM:
bundleIdentifier: "com.ballingoutloud.app",
// TO:
bundleIdentifier: "com.BOL.stattracker",
```

**Step 2: Update Android package to match**

In `app.config.js`, change line 31:
```javascript
// FROM:
package: "com.ballingoutloud.app",
// TO:
package: "com.BOL.stattracker",
```

**Step 3: Update splash background to white (prep for shadcn neutral theme)**

In `app.config.js`, change line 12:
```javascript
// FROM:
backgroundColor: "#1a1a2e",
// TO:
backgroundColor: "#FFFFFF",
```

And line 29:
```javascript
// FROM:
backgroundColor: "#1a1a2e",
// TO:
backgroundColor: "#FFFFFF",
```

**Step 4: Commit**

```bash
git add app.config.js
git commit -m "fix: update bundle ID to match App Store Connect (com.BOL.stattracker)"
```

### Task 2: Verify EAS Credentials & Build

**Step 1: Verify EAS CLI is installed**

Run: `npx eas --version`
Expected: Version >= 12.0.0

**Step 2: Verify credentials**

Run: `npx eas credentials --platform ios`
Expected: Shows existing distribution certificate and provisioning profile for com.BOL.stattracker. If profile is for old bundle ID, select "Create new" when prompted.

**Step 3: Run production build**

Run: `npx eas build --platform ios --profile production`
Expected: Build queues on EAS, monitor at expo.dev dashboard. Build takes ~10-20 min.

**Step 4: Submit to TestFlight**

Run: `npx eas submit --platform ios --latest`
Expected: Uploads .ipa to App Store Connect. Processing takes ~15-30 min.

**Step 5: Enable for testing in App Store Connect**

- Go to App Store Connect → Stat Tracker by BOL → TestFlight
- Click the new build once it finishes processing
- Export compliance: "Yes" (uses HTTPS via Supabase) → "Exempt" (standard HTTPS/TLS)
- Add internal testers to group
- Enable build for testing

**Step 6: Verify on device**

- Install via TestFlight app
- Test: Login → Game Stream → tap game → Live Stats → track some stats → Box Score
- Confirm Supabase data loads correctly

---

## Phase 2: shadcn Redesign

### Task 3: Install NativeWind + Tailwind CSS

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`
- Create: `global.css`
- Modify: `babel.config.js`
- Create: `metro.config.js`
- Modify: `tsconfig.json`
- Modify: `App.tsx`

**Step 1: Install NativeWind and peer dependencies**

Run:
```bash
cd /home/aunray/Desktop/github_repositories/stat_tracker
npx expo install nativewind tailwindcss react-native-reanimated
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
```

**Step 2: Create tailwind.config.js**

Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: "hsl(240, 5.9%, 90%)",
        input: "hsl(240, 5.9%, 90%)",
        ring: "hsl(240, 5.9%, 10%)",
        background: "hsl(0, 0%, 100%)",
        foreground: "hsl(240, 10%, 3.9%)",
        primary: {
          DEFAULT: "hsl(240, 5.9%, 10%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        secondary: {
          DEFAULT: "hsl(240, 4.8%, 95.9%)",
          foreground: "hsl(240, 5.9%, 10%)",
        },
        destructive: {
          DEFAULT: "hsl(0, 84.2%, 60.2%)",
          foreground: "hsl(0, 0%, 98%)",
        },
        muted: {
          DEFAULT: "hsl(240, 4.8%, 95.9%)",
          foreground: "hsl(240, 3.8%, 46.1%)",
        },
        accent: {
          DEFAULT: "hsl(240, 4.8%, 95.9%)",
          foreground: "hsl(240, 5.9%, 10%)",
        },
        card: {
          DEFAULT: "hsl(0, 0%, 100%)",
          foreground: "hsl(240, 10%, 3.9%)",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

**Step 3: Create global.css**

Create `global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 4: Update babel.config.js**

Replace `babel.config.js`:
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

**Step 5: Create metro.config.js**

Create `metro.config.js`:
```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

**Step 6: Update tsconfig.json — add nativewind types**

Add to `compilerOptions` in `tsconfig.json`:
```json
"types": ["nativewind/types"]
```

And add `"nativewind-env.d.ts"` to the `include` array.

**Step 7: Import global.css in App.tsx**

Add to top of `App.tsx`:
```typescript
import "./global.css";
```

**Step 8: Verify NativeWind works**

Run: `npx expo start --clear`
Expected: App starts without errors. Add a test `className="bg-red-500"` to any View to verify Tailwind classes apply.

**Step 9: Commit**

```bash
git add tailwind.config.js global.css babel.config.js metro.config.js tsconfig.json App.tsx package.json package-lock.json
git commit -m "feat: add NativeWind + Tailwind CSS with shadcn neutral theme"
```

### Task 4: Create shadcn Utility Functions

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/constants.ts`

**Step 1: Create cn utility**

Create `src/lib/utils.ts`:
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Step 2: Create design constants**

Create `src/lib/constants.ts`:
```typescript
export const NAV_THEME = {
  light: {
    background: "hsl(0, 0%, 100%)",
    border: "hsl(240, 5.9%, 90%)",
    card: "hsl(0, 0%, 100%)",
    notification: "hsl(0, 84.2%, 60.2%)",
    primary: "hsl(240, 5.9%, 10%)",
    text: "hsl(240, 10%, 3.9%)",
  },
  dark: {
    background: "hsl(240, 10%, 3.9%)",
    border: "hsl(240, 3.7%, 15.9%)",
    card: "hsl(240, 10%, 3.9%)",
    notification: "hsl(0, 72%, 51%)",
    primary: "hsl(0, 0%, 98%)",
    text: "hsl(0, 0%, 98%)",
  },
};
```

**Step 3: Commit**

```bash
git add src/lib/utils.ts src/lib/constants.ts
git commit -m "feat: add shadcn utility functions (cn, NAV_THEME)"
```

### Task 5: Install react-native-reusables Core Components

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/separator.tsx`
- Create: `src/components/ui/skeleton.tsx`
- Create: `src/components/ui/switch.tsx`
- Create: `src/components/ui/text.tsx`
- Create: `src/components/ui/typography.tsx`
- Create: `src/components/ui/table.tsx`

**Step 1: Install reusables components via CLI**

Run:
```bash
cd /home/aunray/Desktop/github_repositories/stat_tracker
npx @react-native-reusables/cli add button card input badge separator skeleton switch text typography table
```

If CLI doesn't support `add` for existing projects, manually copy component files from the react-native-reusables repo into `src/components/ui/`. Each component follows the shadcn pattern: exports a styled primitive with `className` prop support via `cn()`.

**Step 2: Verify components import correctly**

Create a temporary test in any screen — import `Button` from `~/components/ui/button` and render it. Confirm it displays with shadcn styling.

**Step 3: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add react-native-reusables UI components (button, card, input, badge, etc.)"
```

### Task 6: Migrate Auth Screens

**Files:**
- Modify: `src/screens/auth/LoginScreen.tsx`
- Modify: `src/screens/auth/SignUpScreen.tsx`
- Modify: `src/screens/auth/OnboardingScreen.tsx`

**Step 1: Read each auth screen to understand current structure**

Read all three files to understand current Paper component usage and layout.

**Step 2: Migrate LoginScreen.tsx**

Replace Paper components with reusables:
- `TextInput` → `Input` from `~/components/ui/input`
- `Button` → `Button` from `~/components/ui/button`
- `StyleSheet` styles → `className` with Tailwind classes
- Background: `className="flex-1 bg-background p-6 justify-center"`
- Card wrapper: `className="bg-card rounded-lg border border-border p-6"`
- Typography: `Text` from `~/components/ui/text`

**Step 3: Migrate SignUpScreen.tsx**

Same pattern as LoginScreen — forms with Input + Button + Text.

**Step 4: Migrate OnboardingScreen.tsx**

Same pattern — replace Paper components with reusables equivalents.

**Step 5: Verify all auth screens render correctly**

Run: `npx expo start --clear`
Navigate through Login → SignUp → back. Confirm styling is clean neutral shadcn.

**Step 6: Commit**

```bash
git add src/screens/auth/
git commit -m "feat: migrate auth screens to shadcn styling"
```

### Task 7: Migrate GameStream Screen

**Files:**
- Modify: `src/screens/game/GameStreamScreen.tsx`
- Modify: `src/components/game/GameCard.tsx`
- Modify: `src/components/common/SearchBar.tsx`

**Step 1: Read GameStreamScreen, GameCard, SearchBar**

Understand current layout, filter tabs, and card rendering.

**Step 2: Migrate GameCard.tsx**

- Paper `Card` → reusables `Card`, `CardHeader`, `CardContent`
- Status chip → `Badge` with variant (default for scheduled, destructive for live, secondary for completed)
- Score text → `Text` with `className="text-2xl font-bold text-foreground"`
- Team names → `Text` with `className="text-sm text-muted-foreground"`

**Step 3: Migrate SearchBar.tsx**

- Paper `Searchbar` → reusables `Input` with search icon prefix
- `className="bg-secondary border-border"`

**Step 4: Migrate GameStreamScreen.tsx**

- Filter tabs → row of `Button` components with `variant="outline"` / `variant="default"` for active
- FlatList remains (RN primitive)
- Background: `className="flex-1 bg-background"`
- Header area: `className="p-4 gap-3"`

**Step 5: Verify game stream renders with cards, search, filters**

Run app, confirm GameStream shows games with new styling.

**Step 6: Commit**

```bash
git add src/screens/game/GameStreamScreen.tsx src/components/game/GameCard.tsx src/components/common/SearchBar.tsx
git commit -m "feat: migrate GameStream screen to shadcn styling"
```

### Task 8: Migrate GameDetail Screen

**Files:**
- Modify: `src/screens/game/GameDetailScreen.tsx`
- Modify: `src/components/game/ScoreBoard.tsx`

**Step 1: Read GameDetailScreen and ScoreBoard**

**Step 2: Migrate ScoreBoard.tsx**

- Wrap in `Card` with `CardContent`
- Team names: `Text` with `className="text-lg font-semibold text-foreground"`
- Scores: `Text` with `className="text-4xl font-bold text-foreground"`
- Quarter indicator: `Badge` with `variant="secondary"`
- Separator between teams

**Step 3: Migrate GameDetailScreen.tsx**

- Background: `className="flex-1 bg-background p-4"`
- Action buttons (Live Stats, Box Score): `Button` with `variant="default"` and `variant="outline"`
- Remove Court Vision navy colors

**Step 4: Verify navigation: GameStream → GameDetail works**

**Step 5: Commit**

```bash
git add src/screens/game/GameDetailScreen.tsx src/components/game/ScoreBoard.tsx
git commit -m "feat: migrate GameDetail screen to shadcn styling"
```

### Task 9: Migrate LiveStat Screen

**Files:**
- Modify: `src/screens/game/LiveStatScreen.tsx`
- Modify: `src/components/stats/StatButton.tsx`
- Modify: `src/components/stats/PlayerStatRow.tsx`
- Modify: `src/components/stats/TeamTotals.tsx`

**Step 1: Read all LiveStat-related files**

**Step 2: Migrate StatButton.tsx**

- Use reusables `Button` with size variants
- Made shots: `variant="default"` (dark)
- Missed shots: `variant="outline"`
- Actions (rebound, assist, etc.): `variant="secondary"`
- Negative (turnover, foul): `variant="destructive"`
- `className="min-w-[72px] h-12"`

**Step 3: Migrate PlayerStatRow.tsx**

- Use `Text` components with Tailwind classes
- Player name: `className="font-medium text-foreground"`
- Stats: `className="text-sm text-muted-foreground tabular-nums"`

**Step 4: Migrate TeamTotals.tsx**

- `Card` wrapper with `CardHeader` + `CardContent`
- Stat values: `className="text-lg font-bold text-foreground tabular-nums"`

**Step 5: Migrate LiveStatScreen.tsx**

- Background: `className="flex-1 bg-background"`
- Player selector area: `className="p-4 border-b border-border"`
- Stat button grid: `className="flex-row flex-wrap gap-2 p-4"`
- Undo button: `Button` with `variant="outline"` + undo icon

**Step 6: Verify live stat tracking works end-to-end**

Track a few stats, verify undo, confirm data persists.

**Step 7: Commit**

```bash
git add src/screens/game/LiveStatScreen.tsx src/components/stats/
git commit -m "feat: migrate LiveStat screen to shadcn styling"
```

### Task 10: Migrate GameSummary Screen

**Files:**
- Modify: `src/screens/game/GameSummaryScreen.tsx`
- Modify: `src/components/game/GameSummaryHeader.tsx`
- Modify: `src/components/game/GameSummaryError.tsx`
- Modify: `src/components/game/TeamSection.tsx`
- Modify: `src/components/game/TeamHeader.tsx`
- Modify: `src/components/game/TeamTotalsRow.tsx`
- Modify: `src/components/game/StatsHeader.tsx`
- Modify: `src/components/game/PlayerRow.tsx`

**Step 1: Read all GameSummary component files**

**Step 2: Migrate box score components to use Table from reusables**

- `StatsHeader` → table header row with `className="bg-muted"`
- `PlayerRow` → table body row with alternating `className="bg-background"` / `className="bg-muted/50"`
- `TeamTotalsRow` → table footer row with `className="font-bold border-t border-border"`
- `TeamHeader` → `Text` with `className="text-xl font-bold text-foreground"` + score badge
- `TeamSection` → `Card` wrapping the table

**Step 3: Migrate GameSummaryHeader.tsx**

- Back button: `Button` with `variant="ghost"` + chevron icon
- Refresh: `Button` with `variant="ghost"` + refresh icon
- Title: `Text` with `className="text-lg font-semibold"`

**Step 4: Migrate GameSummaryError.tsx**

- Error card: `Card` with `className="border-destructive"`
- Retry button: `Button` with `variant="destructive"`

**Step 5: Migrate GameSummaryScreen.tsx**

- Background: `className="flex-1 bg-background"`
- ScrollView content: `className="p-4 gap-4"`

**Step 6: Verify box score renders correctly with real game data**

**Step 7: Commit**

```bash
git add src/screens/game/GameSummaryScreen.tsx src/components/game/
git commit -m "feat: migrate GameSummary/BoxScore to shadcn styling"
```

### Task 11: Migrate Team & Player Screens

**Files:**
- Modify: `src/screens/team/TeamListScreen.tsx`
- Modify: `src/screens/team/TeamDetailScreen.tsx`
- Modify: `src/screens/team/CreateTeamScreen.tsx`
- Modify: `src/screens/player/PlayerListScreen.tsx`
- Modify: `src/screens/player/PlayerDetailScreen.tsx`
- Modify: `src/screens/player/CreatePlayerScreen.tsx`

**Step 1: Read all team and player screen files**

**Step 2: Migrate TeamListScreen**

- Team cards: `Card` + `CardHeader` + `CardContent`
- Search: reusables `Input`
- Add team button: `Button` with `variant="default"`

**Step 3: Migrate TeamDetailScreen**

- Player roster list with `Separator` between items
- "Coming Soon" badge for season stats

**Step 4: Migrate PlayerListScreen**

- Position filter: row of `Button` with `variant="outline"` / `variant="default"`
- Player cards: `Card` with jersey number `Badge`

**Step 5: Migrate PlayerDetailScreen**

- Stat cards: `Card` with `CardHeader` (stat name) + `CardContent` (value)
- Layout: grid of stat cards

**Step 6: Migrate Create screens (stubs)**

- Form inputs: `Input` components
- Submit: `Button` with `variant="default"`

**Step 7: Verify all team/player navigation flows**

**Step 8: Commit**

```bash
git add src/screens/team/ src/screens/player/
git commit -m "feat: migrate Team & Player screens to shadcn styling"
```

### Task 12: Migrate Profile & Settings Screens

**Files:**
- Modify: `src/screens/profile/ProfileScreen.tsx`
- Modify: `src/screens/profile/SettingsScreen.tsx`

**Step 1: Read both files**

**Step 2: Migrate ProfileScreen**

- User info card: `Card` with avatar area + name + role `Badge`
- Sign out: `Button` with `variant="destructive"`
- Menu items: `Button` with `variant="ghost"` + chevron

**Step 3: Migrate SettingsScreen**

- Toggle rows: label `Text` + reusables `Switch`
- Section headers: `Text` with `className="text-sm font-medium text-muted-foreground uppercase tracking-wide"`
- Separators between sections

**Step 4: Verify profile and settings render**

**Step 5: Commit**

```bash
git add src/screens/profile/
git commit -m "feat: migrate Profile & Settings screens to shadcn styling"
```

### Task 13: Update Navigation Header Styling

**Files:**
- Modify: `src/navigation/MainNavigator.tsx`

**Step 1: Update stack navigator screen options**

Replace Court Vision navy headers with shadcn neutral:
```typescript
screenOptions={{
  headerStyle: {
    backgroundColor: '#FFFFFF',
  },
  headerTintColor: '#09090B',
  headerTitleStyle: {
    fontWeight: '600',
  },
  contentStyle: {
    backgroundColor: '#FFFFFF',
  },
  headerShadowVisible: false,
  headerBackTitleVisible: false,
}}
```

**Step 2: Verify all screen headers render with neutral styling**

**Step 3: Commit**

```bash
git add src/navigation/MainNavigator.tsx
git commit -m "feat: update navigation headers to shadcn neutral theme"
```

### Task 14: Remove React Native Paper

**Files:**
- Modify: `App.tsx`
- Modify: `package.json`
- Delete: `src/config/theme.ts`

**Step 1: Remove PaperProvider from App.tsx**

Update `App.tsx`:
```typescript
import "./global.css";
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/store/store';
import MainNavigator from './src/navigation/MainNavigator';

const queryClient = new QueryClient();

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MainNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
```

**Step 2: Grep for any remaining react-native-paper imports**

Run: `grep -r "react-native-paper" src/`
Expected: No results. If any remain, update those files.

**Step 3: Delete theme.ts**

Run: `rm src/config/theme.ts`

**Step 4: Uninstall react-native-paper**

Run: `npm uninstall react-native-paper`

**Step 5: Verify app starts and all screens work without Paper**

Run: `npx expo start --clear`

**Step 6: Commit**

```bash
git add App.tsx package.json package-lock.json
git rm src/config/theme.ts
git commit -m "chore: remove react-native-paper dependency"
```

### Task 15: Deploy Redesigned App to TestFlight

**Step 1: Run type check**

Run: `npm run type-check`
Expected: No errors

**Step 2: Run lint**

Run: `npm run lint`
Expected: No errors (or only warnings)

**Step 3: Build for production**

Run: `npx eas build --platform ios --profile production`

**Step 4: Submit to TestFlight**

Run: `npx eas submit --platform ios --latest`

**Step 5: Verify redesigned app on device via TestFlight**

**Step 6: Commit version bump if needed**

---

## Phase 3: Web Tracker Rebuild

### Task 16: Set Up Expo Router for Web

**Files:**
- Modify: `package.json`
- Modify: `app.config.js`
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`
- Modify: `App.tsx` (keep for native, add router for web)

**Step 1: Install expo-router**

Run:
```bash
npx expo install expo-router expo-linking expo-status-bar
```

**Step 2: Update app.config.js for expo-router**

Add to plugins array:
```javascript
plugins: [
  "./plugins/withRemovePushEntitlement",
  ["expo-router", {
    origin: "https://ballingoutloud.app",
    asyncRoutes: {
      web: true,
      default: "development",
    },
  }],
],
```

Update `main` in `package.json`:
```json
"main": "expo-router/entry"
```

**Step 3: Create app/_layout.tsx (root layout)**

```typescript
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
```

**Step 4: Create app/index.tsx (redirects to games)**

```typescript
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/games" />;
}
```

**Step 5: Verify expo-router loads on web**

Run: `npx expo start --web --clear`
Expected: Redirects to /games (will 404 until we add the route — that's fine).

**Step 6: Commit**

```bash
git add app/ package.json app.config.js
git commit -m "feat: add Expo Router with web routing support"
```

### Task 17: Create Web Game Routes

**Files:**
- Create: `app/games/index.tsx`
- Create: `app/games/[id]/index.tsx`
- Create: `app/games/[id]/live.tsx`
- Create: `app/games/[id]/summary.tsx`

**Step 1: Create app/games/index.tsx**

This wraps the existing `GameStreamScreen` component for web:
```typescript
import { Platform, View } from "react-native";
import GameStreamScreen from "../../src/screens/game/GameStreamScreen";

export default function GamesPage() {
  return (
    <View className={Platform.OS === "web" ? "max-w-5xl mx-auto w-full" : "flex-1"}>
      <GameStreamScreen />
    </View>
  );
}
```

**Step 2: Create app/games/[id]/index.tsx**

Wraps `GameDetailScreen`, extracts `id` from Expo Router params:
```typescript
import { useLocalSearchParams } from "expo-router";
import { Platform, View } from "react-native";
import GameDetailScreen from "../../../src/screens/game/GameDetailScreen";

export default function GameDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className={Platform.OS === "web" ? "max-w-5xl mx-auto w-full" : "flex-1"}>
      <GameDetailScreen route={{ params: { gameId: id } } as any} />
    </View>
  );
}
```

**Step 3: Create app/games/[id]/live.tsx**

Wraps `LiveStatScreen` with keyboard shortcut support:
```typescript
import { useLocalSearchParams } from "expo-router";
import { Platform, View } from "react-native";
import LiveStatScreen from "../../../src/screens/game/LiveStatScreen";
import { useWebKeyboardShortcuts } from "../../../src/hooks/useWebKeyboardShortcuts";

export default function LiveStatPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // Keyboard shortcuts only on web
  if (Platform.OS === "web") {
    useWebKeyboardShortcuts(id);
  }

  return (
    <View className={Platform.OS === "web" ? "max-w-6xl mx-auto w-full" : "flex-1"}>
      <LiveStatScreen route={{ params: { gameId: id } } as any} />
    </View>
  );
}
```

**Step 4: Create app/games/[id]/summary.tsx**

Wraps `GameSummaryScreen`:
```typescript
import { useLocalSearchParams } from "expo-router";
import { Platform, View } from "react-native";
import GameSummaryScreen from "../../../src/screens/game/GameSummaryScreen";

export default function GameSummaryPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className={Platform.OS === "web" ? "max-w-6xl mx-auto w-full" : "flex-1"}>
      <GameSummaryScreen route={{ params: { gameId: id } } as any} />
    </View>
  );
}
```

**Step 5: Verify web routing works**

Run: `npx expo start --web`
Navigate to `/games`, click a game, verify `/games/[id]` loads.

**Step 6: Commit**

```bash
git add app/games/
git commit -m "feat: add web routes for GameStream, GameDetail, LiveStat, GameSummary"
```

### Task 18: Add Keyboard Shortcuts for Web LiveStat

**Files:**
- Create: `src/hooks/useWebKeyboardShortcuts.ts`

**Step 1: Create keyboard shortcut hook**

Create `src/hooks/useWebKeyboardShortcuts.ts`:
```typescript
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAppDispatch } from "../store/store";

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

export function useWebKeyboardShortcuts(gameId: string) {
  const dispatch = useAppDispatch();

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
        // Dispatch missed shot event
        // dispatch(recordStat({ gameId, event: shortcut.shift }));
        console.log(`[Shortcut] ${shortcut.shift}`);
      } else {
        if (shortcut.event === "UNDO") {
          // dispatch(undoLastStat({ gameId }));
          console.log("[Shortcut] UNDO");
        } else {
          // dispatch(recordStat({ gameId, event: shortcut.event }));
          console.log(`[Shortcut] ${shortcut.event}`);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [gameId, dispatch]);
}
```

Note: The dispatch calls are commented with console.log placeholders. Wire them to actual Redux actions / Supabase API calls based on existing `useStats` hook patterns.

**Step 2: Verify keyboard shortcuts fire on web**

Run: `npx expo start --web`
Navigate to `/games/[id]/live`
Press `2`, `3`, `r` — check console for log output.

**Step 3: Commit**

```bash
git add src/hooks/useWebKeyboardShortcuts.ts
git commit -m "feat: add keyboard shortcuts for web LiveStat screen"
```

### Task 19: Add Responsive Layout for Web

**Files:**
- Create: `src/components/layout/WebContainer.tsx`
- Modify: `app/games/index.tsx`
- Modify: `app/games/[id]/index.tsx`
- Modify: `app/games/[id]/live.tsx`
- Modify: `app/games/[id]/summary.tsx`

**Step 1: Create WebContainer component**

Create `src/components/layout/WebContainer.tsx`:
```typescript
import { Platform, View, useWindowDimensions } from "react-native";
import { cn } from "../../lib/utils";

interface WebContainerProps {
  children: React.ReactNode;
  wide?: boolean;
  className?: string;
}

export function WebContainer({ children, wide, className }: WebContainerProps) {
  if (Platform.OS !== "web") {
    return <View className={cn("flex-1", className)}>{children}</View>;
  }

  return (
    <View
      className={cn(
        "flex-1 mx-auto w-full px-4",
        wide ? "max-w-7xl" : "max-w-5xl",
        className
      )}
    >
      {children}
    </View>
  );
}
```

**Step 2: Update web route files to use WebContainer**

Replace the inline `Platform.OS` checks in all 4 route files with `<WebContainer>` wrapper.

**Step 3: Verify responsive layout at different viewport widths**

Test at 375px (mobile), 768px (tablet), 1280px (desktop).

**Step 4: Commit**

```bash
git add src/components/layout/WebContainer.tsx app/games/
git commit -m "feat: add responsive WebContainer layout component"
```

### Task 20: Delete Old Web Tracker & Final Cleanup

**Files:**
- Delete: `web/index.html`
- Delete: `src/components/common/Button.tsx` (replaced by reusables)
- Delete: `src/components/common/Card.tsx` (replaced by reusables)
- Delete: `src/components/common/Loading.tsx` (replaced by Skeleton)
- Modify: Any files still importing old common components

**Step 1: Delete web/index.html**

Run: `rm web/index.html && rmdir web/`

**Step 2: Delete replaced common components**

Run:
```bash
rm src/components/common/Button.tsx
rm src/components/common/Card.tsx
rm src/components/common/Loading.tsx
```

**Step 3: Grep for any remaining imports of deleted files**

Run: `grep -r "components/common/Button\|components/common/Card\|components/common/Loading" src/`
Update any remaining imports to use `~/components/ui/` equivalents.

**Step 4: Run type check**

Run: `npm run type-check`
Expected: No errors

**Step 5: Run lint**

Run: `npm run lint`
Expected: Clean

**Step 6: Verify entire app works**

- Mobile: `npx expo start --ios` — navigate all screens
- Web: `npx expo start --web` — navigate all 4 web routes

**Step 7: Commit**

```bash
git rm web/index.html
git rm src/components/common/Button.tsx src/components/common/Card.tsx src/components/common/Loading.tsx
git add -A
git commit -m "chore: remove old web tracker and replaced common components"
```

### Task 21: Final TestFlight Deploy with Redesign + Web

**Step 1: Bump version**

In `app.config.js`:
```javascript
version: "2.0.0",
// ios:
buildNumber: "2",
// android:
versionCode: 2,
```

**Step 2: Build and submit**

Run:
```bash
npx eas build --platform ios --profile production
npx eas submit --platform ios --latest
```

**Step 3: Verify on TestFlight**

**Step 4: Commit version bump**

```bash
git add app.config.js
git commit -m "chore: bump version to 2.0.0 for shadcn redesign release"
```

# StatTrack / Balling Out Loud — shadcn Redesign & TestFlight Deployment

**Date:** 2026-03-17
**Status:** Approved

## Overview

Three-phase project to ship the current app to TestFlight, redesign the UI with shadcn-inspired components via `react-native-reusables` + NativeWind, and rebuild the web stat tracker as proper Expo Web routes.

## Phase 1 — TestFlight Deployment

Ship the current app as-is to TestFlight. No UI changes.

### Pre-flight Details

| Field | Value |
|---|---|
| Apple Developer Team ID | GCV6CU2GUZ |
| Bundle ID | com.BOL.stattracker |
| App Name | Stat Tracker by BOL |
| SKU | BOLST.v1 |
| Apple ID | 6758524364 |
| EAS Project ID | b9050a25-a3c9-460c-afaf-87371f85a789 |

### Required Fix

Bundle ID mismatch: `app.config.js` has `com.ballingoutloud.app`, App Store Connect has `com.BOL.stattracker`. Must update `app.config.js` to match.

### Protocol

1. **Pre-flight checks** — Verify Apple Developer account, bundle ID, EAS project ID, .env vars, run local build
2. **Fix bundle ID** — Update `app.config.js` ios.bundleIdentifier → `com.BOL.stattracker`
3. **EAS credentials** — Verify existing credentials: `eas credentials --platform ios`
4. **Build** — `eas build --platform ios --profile production`, monitor at expo.dev
5. **Submit** — `eas submit --platform ios`, wait for processing (~15-30 min)
6. **Export compliance** — Yes (HTTPS/TLS via Supabase) → Exempt
7. **Enable for testing** — Add internal testers, enable build
8. **Verify on device** — Install via TestFlight, test auth/game stream/live stats/box score

## Phase 2 — shadcn Redesign

Replace React Native Paper with `react-native-reusables` + NativeWind. Adopt shadcn default neutral palette.

### Dependencies

**Add:**
- `nativewind`
- `tailwindcss`
- `react-native-reusables` (individual components)
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

**Remove:**
- `react-native-paper`

### Theme — shadcn Default Neutral

```
Light:
  Background:    #FFFFFF
  Foreground:    #09090B
  Card:          #FFFFFF
  Primary:       #18181B
  Secondary:     #F4F4F5
  Muted:         #F4F4F5
  Accent:        #F4F4F5
  Destructive:   #EF4444
  Border:        #E4E4E7
  Ring:          #18181B

Dark (optional, later):
  Background:    #09090B
  Foreground:    #FAFAFA
```

### Component Migration Map

| Current (Paper) | New (reusables) |
|---|---|
| Button (custom) | Button with variants (default, destructive, outline, secondary, ghost) |
| Card (custom) | Card, CardHeader, CardContent, CardFooter |
| Loading (custom) | Skeleton / spinner pattern |
| SearchBar (custom) | Input with search icon |
| GameCard | Card + Badge for status |
| ScoreBoard | Custom composition of Card + typography |
| StatButton | Button with size variants + keyboard shortcut labels |
| PlayerRow | Table row or custom list item |
| Paper TextInput | Input |
| Paper Appbar | Custom header with Button (ghost) for nav |
| Paper Menu | DropdownMenu |
| Paper Switch | Switch |
| Paper Chip | Badge |

### Screen Migration Order

1. Auth screens (Login, SignUp, Onboarding) — forms + buttons
2. GameStream — cards + badges + search
3. GameDetail — scoreboard + navigation
4. LiveStat — stat buttons (most complex)
5. GameSummary — table/grid layout
6. Team/Player screens — lists + detail views
7. Profile/Settings — toggles + menu

## Phase 3 — Web Tracker Rebuild

Replace `web/index.html` with Expo Router web routes sharing Phase 2 components.

### Web Screens

| Screen | Route | Web Enhancements |
|---|---|---|
| GameStream | `/games` | 2-3 column card grid, persistent search |
| GameDetail | `/games/[id]` | Side-by-side team display |
| LiveStat | `/games/[id]/live` | Keyboard shortcuts, wider stat grid, player sidebar |
| GameSummary | `/games/[id]/summary` | Full-width table, sortable columns |

### Keyboard Shortcuts (LiveStat, web only)

```
2 → 2PT Made       shift+2 → 2PT Missed
3 → 3PT Made       shift+3 → 3PT Missed
F → FT Made        shift+F → FT Missed
R → Rebound        A → Assist
B → Block          S → Steal
T → Turnover       O → Foul
U → Undo last      Tab → Cycle player
```

### Responsive Breakpoints

- `< 768px` — mobile layout (stacked)
- `768px - 1024px` — tablet (2-column grids)
- `> 1024px` — desktop (sidebar + main content, full tables)

### Navigation

- Expo Router for web routing
- No auth screens on web (mobile-only)
- Simple top nav bar with back navigation

### Cleanup

- Delete `web/index.html` after new web screens are functional

## What Does NOT Change

- Redux Toolkit state management
- Supabase backend / API layer
- React Navigation structure (mobile)
- Custom hooks (useAuth, useGame, useStats, etc.)
- TypeScript types
- Database schema

## Risk

**NativeWind + Expo SDK 54 compatibility** — needs verification during setup. Fallback: manual StyleSheet with shadcn design tokens applied directly.

## Dependency Chain

```
Phase 1 (TestFlight) → Phase 2 (Redesign) → Phase 3 (Web)
```

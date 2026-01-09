# Balling Out Loud - Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and fill in your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Run Database Migrations

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `database/migrations/001_initial_schema.sql`
4. Run the migration

### 4. Configure Authentication

1. In Supabase dashboard, go to Authentication > Settings
2. Enable Email authentication
3. Configure email templates as needed

### 5. Set Up Storage (Optional)

For team logos and player photos:

1. Go to Storage in Supabase dashboard
2. Create buckets: `team-logos` and `player-photos`
3. Set up appropriate policies

## Running the App

### Development

```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Project Structure

```
balling-out-loud/
├── src/
│   ├── api/              # API client functions
│   ├── components/       # Reusable UI components
│   ├── screens/          # Screen components
│   ├── navigation/       # Navigation setup
│   ├── store/            # Redux store and slices
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   └── config/           # Configuration files
├── database/             # Database migrations
├── App.tsx              # Root component
└── package.json
```

## Key Features

- ✅ Authentication (Sign up, Sign in, Sign out)
- ✅ Game Stream Feed
- ✅ Live Stat Tracking
- ✅ Game Summary/Box Score
- ✅ Real-time Updates (via Supabase Realtime)
- ✅ Redux State Management
- ✅ TypeScript Type Safety

## Next Steps

1. **Complete Team Management**: Implement team creation, editing, and roster management
2. **Complete Player Management**: Implement player creation and editing
3. **Enhance Live Stats**: Add player selection modal, possession tracking
4. **Add Offline Support**: Implement local storage and sync
5. **Add Push Notifications**: For game updates
6. **Add Analytics**: Player and team performance analytics
7. **Add Export Features**: PDF/CSV export for box scores

## Troubleshooting

### Common Issues

1. **Supabase connection errors**: Check your `.env` file has correct credentials
2. **Type errors**: Run `npm run type-check` to see detailed errors
3. **Navigation errors**: Ensure all screen components are properly exported
4. **Redux errors**: Check that all slices are added to the store

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Supabase Documentation](https://supabase.com/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)

# Quick Start Guide

## Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Set Up Database

1. Go to your Supabase project dashboard
2. Open SQL Editor
3. Copy and paste the contents of `database/migrations/001_initial_schema.sql`
4. Click "Run"

### Step 4: Start Development Server

```bash
npm start
```

### Step 5: Open on Device/Simulator

- **iOS**: Press `i` in the terminal or scan QR code with Expo Go
- **Android**: Press `a` in the terminal or scan QR code with Expo Go
- **Web**: Press `w` in the terminal

## What's Included

✅ Complete project structure  
✅ Authentication system  
✅ Game management  
✅ Live stat tracking  
✅ Box score generation  
✅ Redux state management  
✅ TypeScript types  
✅ Navigation setup  
✅ UI components  

## First Steps After Setup

1. **Test Authentication**: Sign up a new user
2. **Create a Team**: Navigate to Teams and create your first team
3. **Add Players**: Add players to your team
4. **Create a Game**: Set up a game between two teams
5. **Track Stats**: Use the Live Stats screen during a game

## Need Help?

- Check `SETUP.md` for detailed setup instructions
- Review the code structure in `src/` directory
- See database schema in `database/migrations/001_initial_schema.sql`

## Development Tips

- Use `npm run type-check` to verify TypeScript types
- Use `npm run lint` to check code quality
- All API calls are in `src/api/`
- State management is in `src/store/`
- Custom hooks are in `src/hooks/`

Happy coding! 🏀

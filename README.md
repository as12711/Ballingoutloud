# Balling Out Loud

## StatTrack

> Capture, analyze, and share high school sports statistics in real-time

## Overview

StatTrack by Balling Out Loud is a mobile application designed to bring professional-grade statistics tracking to high school athletics. Built for coaches, players, parents, and fans, StatTrack makes it easy to record game data, generate insights, and celebrate athletic achievement at the prep level.

## Features

### Core Functionality
- **Real-time Stat Entry**: Intuitive interface for recording stats during live games
- **Multi-Sport Support**: Track basketball, football, baseball, soccer, and more
- **Player Profiles**: Comprehensive athlete statistics and performance history
- **Team Management**: Roster organization and season-long tracking
- **Live Game Updates**: Share real-time stats with fans and families
- **Analytics Dashboard**: Visualize performance trends and identify key insights

### For Different Users
- **Coaches**: Track player development, make data-driven decisions
- **Players**: Monitor personal performance and set improvement goals
- **Parents**: Follow your athlete's progress and game performance
- **Fans**: Stay connected with live stats and season highlights

## Tech Stack

- **Frontend**: React Native (iOS & Android)
- **Backend**: Node.js
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Development**: Expo

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Studio (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/BallingOutLoud/stattrack.git

# Navigate to project directory
cd stattrack

# Install dependencies
npm install

# Start development server
npx expo start
```

### Environment Setup

Create a `.env` file in the root directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Project Structure

```
stattrack/
├── app/                    # Main application screens
├── components/             # Reusable UI components
├── services/              # API and backend services
├── utils/                 # Helper functions and utilities
├── assets/                # Images, fonts, and static files
├── config/                # Configuration files
└── types/                 # TypeScript type definitions
```

## Roadmap

### Phase 1: MVP (Current)
- [x] User authentication
- [ ] Basic stat entry (basketball)
- [ ] Player profiles
- [ ] Team management
- [ ] Game creation and tracking

### Phase 2: Enhanced Features
- [ ] Multi-sport support
- [ ] Advanced analytics
- [ ] Social sharing
- [ ] Push notifications
- [ ] Export reports (PDF/CSV)

### Phase 3: Community
- [ ] Public player profiles
- [ ] Leaderboards
- [ ] Recruiting features
- [ ] Video highlights integration

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, or improving documentation, your help is appreciated.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Organization**: Balling Out Loud  
**Project Lead**: Aunray  
**Email**: [your-email]  
**GitHub**: [@BallingOutLoud](https://github.com/BallingOutLoud)

## Acknowledgments

- Inspired by the need for accessible sports analytics at the high school level
- Built with support from the NYU computer science community
- Special thanks to coaches and athletes who provided feedback during development

---

**Note**: This project is actively under development. Features and documentation are subject to change. Star the repo to stay updated on progress!
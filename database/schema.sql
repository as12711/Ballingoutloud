-- Balling Out Loud Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('coach', 'player', 'parent', 'fan', 'admin');
CREATE TYPE game_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled');
CREATE TYPE stat_event_type AS ENUM (
  '2pt_fga', '2pt_fgm', 
  '3pt_fga', '3pt_fgm',
  'ft_fga', 'ft_fgm',
  'foul', 'turnover', 'block', 'steal', 
  'rebound', 'assist', 'substitution',
  'timeout_full', 'timeout_half'
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'fan',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  league TEXT,
  logo_url TEXT,
  coach_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  jersey_number INTEGER NOT NULL,
  position TEXT,
  grade INTEGER,
  height TEXT,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, jersey_number)
);

-- Games table
CREATE TABLE games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  league TEXT,
  status game_status NOT NULL DEFAULT 'scheduled',
  current_quarter INTEGER DEFAULT 1,
  home_score INTEGER DEFAULT 0,
  away_score INTEGER DEFAULT 0,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (home_team_id != away_team_id),
  CHECK (current_quarter >= 1 AND current_quarter <= 4)
);

-- Game stats table (aggregated player stats per game)
CREATE TABLE game_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  fg_attempts INTEGER DEFAULT 0,
  fg_made INTEGER DEFAULT 0,
  three_pt_attempts INTEGER DEFAULT 0,
  three_pt_made INTEGER DEFAULT 0,
  free_throw_attempts INTEGER DEFAULT 0,
  free_throw_made INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

-- Stat events table (individual stat events during game)
CREATE TABLE stat_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  event_type stat_event_type NOT NULL,
  quarter INTEGER NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (quarter >= 1 AND quarter <= 4)
);

-- Team stats table (team-level stats per quarter)
CREATE TABLE team_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL,
  points INTEGER DEFAULT 0,
  fouls INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,
  timeouts_full INTEGER DEFAULT 0,
  timeouts_half INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, team_id, quarter),
  CHECK (quarter >= 1 AND quarter <= 4)
);

-- Create indexes for better query performance
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_games_home_team_id ON games(home_team_id);
CREATE INDEX idx_games_away_team_id ON games(away_team_id);
CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_scheduled_at ON games(scheduled_at);
CREATE INDEX idx_game_stats_game_id ON game_stats(game_id);
CREATE INDEX idx_game_stats_player_id ON game_stats(player_id);
CREATE INDEX idx_stat_events_game_id ON stat_events(game_id);
CREATE INDEX idx_stat_events_player_id ON stat_events(player_id);
CREATE INDEX idx_team_stats_game_id ON team_stats(game_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at
  BEFORE UPDATE ON game_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_stats_updated_at
  BEFORE UPDATE ON team_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE stat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_stats ENABLE ROW LEVEL SECURITY;

-- Users: Can read all, update own profile
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Teams: Anyone can read, coaches can create/update their teams
CREATE POLICY "Anyone can view teams"
  ON teams FOR SELECT
  USING (true);

CREATE POLICY "Coaches can create teams"
  ON teams FOR INSERT
  WITH CHECK (auth.uid() = coach_id);

CREATE POLICY "Coaches can update their teams"
  ON teams FOR UPDATE
  USING (auth.uid() = coach_id);

-- Players: Anyone can read, coaches can manage their team's players
CREATE POLICY "Anyone can view players"
  ON players FOR SELECT
  USING (true);

CREATE POLICY "Coaches can create players for their teams"
  ON players FOR INSERT
  WITH CHECK (
    team_id IN (
      SELECT id FROM teams WHERE coach_id = auth.uid()
    )
  );

CREATE POLICY "Coaches can update their team's players"
  ON players FOR UPDATE
  USING (
    team_id IN (
      SELECT id FROM teams WHERE coach_id = auth.uid()
    )
  );

-- Games: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view games"
  ON games FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create games"
  ON games FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Game creators and team coaches can update games"
  ON games FOR UPDATE
  USING (
    auth.uid() = created_by OR
    auth.uid() IN (
      SELECT coach_id FROM teams 
      WHERE id IN (home_team_id, away_team_id)
    )
  );

-- Game Stats: Anyone can read, authenticated users can create/update
CREATE POLICY "Anyone can view game stats"
  ON game_stats FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create game stats"
  ON game_stats FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update game stats"
  ON game_stats FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Stat Events: Anyone can read, authenticated users can create
CREATE POLICY "Anyone can view stat events"
  ON stat_events FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create stat events"
  ON stat_events FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Team Stats: Anyone can read, authenticated users can create/update
CREATE POLICY "Anyone can view team stats"
  ON team_stats FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create team stats"
  ON team_stats FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update team stats"
  ON team_stats FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Create storage buckets for team logos and player photos
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('team-logos', 'team-logos', true),
  ('player-photos', 'player-photos', true);

-- Storage policies
CREATE POLICY "Anyone can view team logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'team-logos');

CREATE POLICY "Coaches can upload team logos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'team-logos' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Anyone can view player photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'player-photos');

CREATE POLICY "Authenticated users can upload player photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'player-photos' AND
    auth.uid() IS NOT NULL
  );

-- Balling Out Loud - Initial Database Schema
-- Run this migration in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('coach', 'player', 'parent', 'fan', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  school TEXT NOT NULL,
  league TEXT NOT NULL,
  logo_url TEXT,
  coach_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Players table
CREATE TABLE IF NOT EXISTS public.players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  jersey_number INTEGER NOT NULL CHECK (jersey_number >= 0 AND jersey_number <= 99),
  position TEXT,
  grade INTEGER CHECK (grade >= 9 AND grade <= 12),
  height TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, jersey_number)
);

-- Games table
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  league TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  current_quarter INTEGER DEFAULT 1 CHECK (current_quarter >= 1),
  home_score INTEGER DEFAULT 0 CHECK (home_score >= 0),
  away_score INTEGER DEFAULT 0 CHECK (away_score >= 0),
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (home_team_id != away_team_id)
);

-- Game stats table (aggregated stats per player per game)
CREATE TABLE IF NOT EXISTS public.game_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0 CHECK (points >= 0),
  rebounds INTEGER DEFAULT 0 CHECK (rebounds >= 0),
  assists INTEGER DEFAULT 0 CHECK (assists >= 0),
  steals INTEGER DEFAULT 0 CHECK (steals >= 0),
  blocks INTEGER DEFAULT 0 CHECK (blocks >= 0),
  turnovers INTEGER DEFAULT 0 CHECK (turnovers >= 0),
  fouls INTEGER DEFAULT 0 CHECK (fouls >= 0),
  fg_attempts INTEGER DEFAULT 0 CHECK (fg_attempts >= 0),
  fg_made INTEGER DEFAULT 0 CHECK (fg_made >= 0 AND fg_made <= fg_attempts),
  three_pt_attempts INTEGER DEFAULT 0 CHECK (three_pt_attempts >= 0),
  three_pt_made INTEGER DEFAULT 0 CHECK (three_pt_made >= 0 AND three_pt_made <= three_pt_attempts),
  free_throw_attempts INTEGER DEFAULT 0 CHECK (free_throw_attempts >= 0),
  free_throw_made INTEGER DEFAULT 0 CHECK (free_throw_made >= 0 AND free_throw_made <= free_throw_attempts),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, player_id)
);

-- Stat events table (individual events for undo functionality)
CREATE TABLE IF NOT EXISTS public.stat_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    '2pt_fga', '2pt_fgm', '3pt_fga', '3pt_fgm',
    'foul', 'turnover', 'block', 'steal', 'rebound', 'assist',
    'substitution', 'timeout', 'free_throw_attempt', 'free_throw_made'
  )),
  quarter INTEGER NOT NULL CHECK (quarter >= 1),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team stats table (quarter-by-quarter team stats)
CREATE TABLE IF NOT EXISTS public.team_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  quarter INTEGER NOT NULL CHECK (quarter >= 1),
  points INTEGER DEFAULT 0 CHECK (points >= 0),
  fouls INTEGER DEFAULT 0 CHECK (fouls >= 0),
  turnovers INTEGER DEFAULT 0 CHECK (turnovers >= 0),
  timeouts_full INTEGER DEFAULT 0 CHECK (timeouts_full >= 0),
  timeouts_half INTEGER DEFAULT 0 CHECK (timeouts_half >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, team_id, quarter)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_games_status ON public.games(status);
CREATE INDEX IF NOT EXISTS idx_games_scheduled_at ON public.games(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_game_stats_game_id ON public.game_stats(game_id);
CREATE INDEX IF NOT EXISTS idx_game_stats_player_id ON public.game_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_stat_events_game_id ON public.stat_events(game_id);
CREATE INDEX IF NOT EXISTS idx_stat_events_player_id ON public.stat_events(player_id);
CREATE INDEX IF NOT EXISTS idx_players_team_id ON public.players(team_id);
CREATE INDEX IF NOT EXISTS idx_teams_coach_id ON public.teams(coach_id);

-- Functions to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON public.players
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_stats_updated_at BEFORE UPDATE ON public.game_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_team_stats_updated_at BEFORE UPDATE ON public.team_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stat_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_stats ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your security requirements)
-- Users can read their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Teams are readable by authenticated users
CREATE POLICY "Teams are viewable by authenticated users" ON public.teams
  FOR SELECT USING (auth.role() = 'authenticated');

-- Coaches can manage their teams
CREATE POLICY "Coaches can manage own teams" ON public.teams
  FOR ALL USING (
    auth.uid() = coach_id OR
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Similar policies for other tables...
-- (Add more specific policies based on your requirements)

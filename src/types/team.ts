export interface Team {
  id: string;
  name: string;
  school: string;
  league: string;
  logoUrl?: string;
  coachId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamWithStats extends Team {
  wins: number;
  losses: number;
  avgPoints: number;
  playerCount: number;
}

export interface CreateTeamInput {
  name: string;
  school: string;
  league?: string;
  logo_url?: string;
  coach_id: string;
}

export interface UpdateTeamInput {
  name?: string;
  school?: string;
  league?: string;
  logo_url?: string;
}

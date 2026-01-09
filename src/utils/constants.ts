export const QUARTERS = [1, 2, 3, 4] as const;
export const OVERTIME_QUARTERS = [5, 6, 7, 8] as const;

export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'] as const;

export const STAT_EVENT_TYPES = {
  TWO_PT_FGA: '2pt_fga',
  TWO_PT_FGM: '2pt_fgm',
  THREE_PT_FGA: '3pt_fga',
  THREE_PT_FGM: '3pt_fgm',
  FOUL: 'foul',
  TURNOVER: 'turnover',
  BLOCK: 'block',
  STEAL: 'steal',
  REBOUND: 'rebound',
  ASSIST: 'assist',
  SUBSTITUTION: 'substitution',
  TIMEOUT: 'timeout',
  FREE_THROW_ATTEMPT: 'free_throw_attempt',
  FREE_THROW_MADE: 'free_throw_made',
} as const;

export const GAME_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const USER_ROLES = {
  COACH: 'coach',
  PLAYER: 'player',
  PARENT: 'parent',
  FAN: 'fan',
  ADMIN: 'admin',
} as const;

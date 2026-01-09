import { GameStats } from '../types/stat';

export const calculateFGPercentage = (stats: GameStats): number => {
  if (stats.fg_attempts === 0) return 0;
  return (stats.fg_made / stats.fg_attempts) * 100;
};

export const calculate3PTPercentage = (stats: GameStats): number => {
  if (stats.three_pt_attempts === 0) return 0;
  return (stats.three_pt_made / stats.three_pt_attempts) * 100;
};

export const calculateFTPercentage = (stats: GameStats): number => {
  if (stats.free_throw_attempts === 0) return 0;
  return (stats.free_throw_made / stats.free_throw_attempts) * 100;
};

export const calculateTotalPoints = (stats: GameStats): number => {
  return (
    stats.fg_made * 2 +
    stats.three_pt_made * 3 +
    stats.free_throw_made
  );
};

export const calculateEfficiency = (stats: GameStats): number => {
  return (
    stats.points +
    stats.rebounds +
    stats.assists +
    stats.steals +
    stats.blocks -
    (stats.turnovers + stats.fouls)
  );
};

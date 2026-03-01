import { GameStats } from '../types/stat';

export const calculateFGPercentage = (stats: GameStats): number => {
  if (stats.fgAttempts === 0) return 0;
  return (stats.fgMade / stats.fgAttempts) * 100;
};

export const calculate3PTPercentage = (stats: GameStats): number => {
  if (stats.threePtAttempts === 0) return 0;
  return (stats.threePtMade / stats.threePtAttempts) * 100;
};

export const calculateFTPercentage = (stats: GameStats): number => {
  if (stats.freeThrowAttempts === 0) return 0;
  return (stats.freeThrowMade / stats.freeThrowAttempts) * 100;
};

export const calculateTotalPoints = (stats: GameStats): number => {
  return (
    stats.fgMade * 2 +
    stats.threePtMade * 3 +
    stats.freeThrowMade
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

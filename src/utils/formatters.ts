export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return `${formatDate(date)} at ${formatTime(date)}`;
};

export const formatPlayerName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

export const formatQuarter = (quarter: number): string => {
  if (quarter <= 4) {
    return `Q${quarter}`;
  }
  return `OT${quarter - 4}`;
};

export const formatScore = (home: number, away: number): string => {
  return `${home} - ${away}`;
};

export const formatStatPercentage = (made: number, attempts: number): string => {
  if (attempts === 0) return '0%';
  const percentage = (made / attempts) * 100;
  return `${percentage.toFixed(1)}%`;
};

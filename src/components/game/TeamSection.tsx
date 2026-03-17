/**
 * Complete team section component for game summary
 * Displays team header, totals, column headers, and all player rows
 * @module components/game/TeamSection
 */

import React from 'react';
import { TeamBoxScoreData } from '../../types/gameSummary';
import { Card, CardContent } from '@/components/ui/card';
import { TeamHeader } from './TeamHeader';
import { TeamTotalsRow } from './TeamTotalsRow';
import { StatsHeader } from './StatsHeader';
import { PlayerRow } from './PlayerRow';

interface TeamSectionProps {
  team: TeamBoxScoreData;
  isHome: boolean;
  testID?: string;
}

/**
 * Complete team section displaying all team statistics
 * Includes: team header, team totals, column headers, and player rows
 */
export const TeamSection: React.FC<TeamSectionProps> = ({ team, isHome, testID }) => {
  return (
    <Card className="overflow-hidden" testID={testID}>
      {/* Team Header */}
      <TeamHeader
        teamName={team.teamName}
        score={team.totalPoints}
        isHome={isHome}
        testID={`${testID}-header`}
      />

      <CardContent className="p-0">
        {/* Team Totals Row */}
        <TeamTotalsRow
          totals={{
            points: team.totalPoints,
            rebounds: team.totalRebounds,
            assists: team.totalAssists,
            pfTf: team.totalPfTf,
          }}
          testID={`${testID}-totals`}
        />

        {/* Column Headers */}
        <StatsHeader testID={`${testID}-stats-header`} />

        {/* Player Rows */}
        {team.players.map((player, index) => (
          <PlayerRow
            key={player.id}
            player={player}
            index={index}
            testID={`${testID}-player-${player.id}`}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamSection;

/**
 * Team header component displaying team name and total score
 * @module components/game/TeamHeader
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TeamHeaderProps {
  teamName: string;
  score: number;
  isHome?: boolean;
  testID?: string;
}

/**
 * Team header displaying team name and total points
 * Used at the top of each team's section in the game summary
 */
export const TeamHeader: React.FC<TeamHeaderProps> = ({ 
  teamName, 
  score, 
  isHome = false,
  testID 
}) => {
  return (
    <View style={[styles.container, isHome ? styles.homeHeader : styles.awayHeader]} testID={testID}>
      <Text style={styles.teamName}>{teamName}</Text>
      <Text style={styles.teamScore}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  homeHeader: {
    backgroundColor: '#000',
  },
  awayHeader: {
    backgroundColor: '#000',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  teamScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default TeamHeader;

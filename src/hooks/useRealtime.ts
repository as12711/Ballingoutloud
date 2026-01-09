import { useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { Game } from '../types/game';
import { StatEvent } from '../types/stat';

export const useRealtime = (gameId: string | null) => {
  const [gameUpdate, setGameUpdate] = useState<Game | null>(null);
  const [statEvents, setStatEvents] = useState<StatEvent[]>([]);

  useEffect(() => {
    if (!gameId) return;

    // Subscribe to game updates
    const gameChannel = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          setGameUpdate(payload.new as Game);
        }
      )
      .subscribe();

    // Subscribe to stat events
    const statsChannel = supabase
      .channel(`stats:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'stat_events',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          setStatEvents((prev) => [...prev, payload.new as StatEvent]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameChannel);
      supabase.removeChannel(statsChannel);
    };
  }, [gameId]);

  return { gameUpdate, statEvents };
};

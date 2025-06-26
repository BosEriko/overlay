'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../_hooks/useWebsocket';
import Window from '../_components/Window';

export default function Leaderboard() {
  const { wsData } = useWebSocket();
  const [leaderboard, setLeaderboard] = useState({});

  useEffect(() => {
    if (wsData?.type === 'LEADERBOARD_UPDATE') {
      setLeaderboard({ ...wsData.leaderboard });
    }
  }, [wsData]);

  if (!leaderboard || Object.keys(leaderboard).length === 0) return null;

  return (
    <Window title="🏆 Typing Score">
      <ol style={{ paddingLeft: '1rem', margin: 0 }} className="text-white text-4xl bg-blue-400 p-5 flex flex-col gap-3">
        {Object.entries(leaderboard)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([user, score]) => (
            <li key={user}>{user}: {score}</li>
          ))}
      </ol>
    </Window>
  );
}

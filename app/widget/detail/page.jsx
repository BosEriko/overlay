'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import { Pixelify_Sans } from 'next/font/google';
import env from '../../_utilities/env';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faIdCard,
  faClock,
  faRankingStar,
  faGamepad,
} from '@fortawesome/free-solid-svg-icons';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const Container = ({ children }) => (
  <div className="h-[1080px] w-[1920px] flex items-end justify-center gap-4">
    {children}
  </div>
);

const Box = ({ children }) => (
  <div className={`${pixelify.className} bg-yellow-300 rounded-full overflow-hidden shadow-xl text-center border-[5px] border-yellow-500 mb-5`}>
    <div className="text-yellow-800 text-xl py-1.5 px-3 flex items-center justify-center gap-3">
      {children}
    </div>
  </div>
);

export default function DetailWidget() {
  const { wsData } = useWebSocket();
  const [streamDetail, setStreamDetail] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    if (wsData?.type === 'STREAM_DETAIL') {
      setStreamDetail(wsData.streamDetail);
      setIsStreaming(wsData.isStreaming);
    }
  }, [wsData]);

  useEffect(() => {
    const fetchTetrioData = async () => {
      try {
        const res = await fetch(`${env.server}/api/profile/tetrio?username=boseriko`);
        const json = await res.json();
        if (json?.username) setGameData(json);
      } catch (error) {
        console.error('Failed to fetch TETR.IO data:', error);
      }
    };

    if (isStreaming) {
      if (streamDetail?.game_name === 'TETR.IO') fetchTetrioData();
    }
  }, [isStreaming, streamDetail]);

  if (!isStreaming) return null;

  if (streamDetail?.game_name === 'TETR.IO') {
    const username = gameData?.username || 'Unknown';
    const totalGames = gameData?.gamesplayed || 0;
    const gamesWon = gameData?.gameswon || 0;
    const winRate = totalGames > 0 ? ((gamesWon / totalGames) * 100).toFixed(1) + '%' : 'N/A';
    const hoursPlayed = gameData?.gametime ? (gameData.gametime / 3600).toFixed(1) : 'N/A';

    return (
      <Container>
        <Box>
          <FontAwesomeIcon icon={faIdCard} className="text-2xl text-yellow-700" />
          <div>Username: {username}</div>
        </Box>
        <Box>
          <FontAwesomeIcon icon={faRankingStar} className="text-2xl text-yellow-700" />
          <div>Win Rate: {winRate}</div>
        </Box>
        <Box>
          <FontAwesomeIcon icon={faClock} className="text-2xl text-yellow-700" />
          <div>Play Time: {hoursPlayed} hrs</div>
        </Box>
      </Container>
    );
  }

  if (streamDetail?.game_name === 'Fortnite') {
    return (
      <Container>
        <Box>Fortnite details coming soon...</Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box>
        <FontAwesomeIcon icon={faGamepad} className="text-2xl text-yellow-700" />
        <div>{streamDetail?.game_name}</div>
      </Box>
    </Container>
  );
}

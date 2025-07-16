'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import { Pixelify_Sans } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const Container = ({ children }) => (
  <div className="h-[1080px] w-[1920px] flex items-start justify-center gap-4 mt-[66px]">
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
  const [firstChatWinner, setFirstChatWinner] = useState(null);
  const [typingWinner, setTypingWinner] = useState(null);

  useEffect(() => {
    if (wsData?.type === 'STREAM_DETAIL') {
      setFirstChatWinner(wsData.winners.firstChat);
      setTypingWinner(wsData.winners.typing);
    }
  }, [wsData]);

  if (!firstChatWinner && !typingWinner) return null;

  return (
    <Container>
      { firstChatWinner && <Box>
        <FontAwesomeIcon icon={faCommentDots} className="text-2xl text-yellow-700" />
        <div>{firstChatWinner}</div>
      </Box> }
      { typingWinner && <Box>
        <FontAwesomeIcon icon={faKeyboard} className="text-2xl text-yellow-700" />
        <div>{typingWinner.winner} ({typingWinner.score})</div>
      </Box> }
    </Container>
  );
}

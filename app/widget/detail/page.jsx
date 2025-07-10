'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import { Pixelify_Sans } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const Container = ({ children }) => {
  return (
    <div className={`${pixelify.className} bg-yellow-300 rounded-full overflow-hidden shadow-xl text-center border-[5px] border-yellow-500`} style={{ borderRadius: '10px' }}>
      <div className="text-white text-yellow-800 text-4xl flex items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
};

export default function DetailWidget() {
  const { wsData } = useWebSocket();
  const [streamDetail, setStreamDetail] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'STREAM_DETAIL') {
      setStreamDetail(wsData.streamDetail);
      setIsStreaming(wsData.isStreaming);
    }
  }, [wsData]);

  if (!isStreaming) return null;

  if (streamDetail?.game_name === "TETR.IO") return (
    <div className="h-[1080px] w-[1920px] flex items-end justify-center">
      <div className="bg-yellow-500">TETR.IO</div>
    </div>
  );

  if (streamDetail?.game_name === "Fortnite") return (
    <div className="h-[1080px] w-[1920px] flex items-end justify-center">
      <div className="bg-yellow-500">Fortnite</div>
    </div>
  );

  return null;
}

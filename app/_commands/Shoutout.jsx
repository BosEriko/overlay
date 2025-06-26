'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../_hooks/useWebsocket';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

export default function Shoutout() {
  const { wsData } = useWebSocket();
  const [photoUrl, setPhotoUrl] = useState(null);
  const [username, setUsername] = useState(null);
  const [visible, setVisible] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!wsData || wsData.type !== 'SHOUTOUT_DETAILS') return;
    setPhotoUrl(wsData?.url);
    setUsername(wsData?.username);
    setVisible(true);
    setFade(false);
    const fadeInTimeout = setTimeout(() => {
      setFade(true);
    }, 50);

    const fadeOutTimeout = setTimeout(() => setFade(false), 9000);
    const hideTimeout = setTimeout(() => setVisible(false), 10000);

    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(hideTimeout);
    };
  }, [wsData]);

  if (!visible) return null;

  return (
    <div className="transition-opacity duration-1000" style={{ opacity: fade ? 1 : 0 }}>
      <div className={`${pixelify.className} bg-yellow-300 rounded-full overflow-hidden shadow-xl text-center`}>
        <div className="text-white text-yellow-800 text-4xl flex items-center justify-center gap-3">
          {photoUrl && <img src={photoUrl} className="w-15 h-15 bg-white rounded-full border-yellow-300 border-5" />}
          <div className="pr-5">Shoutout to {username || 'this streamer'}!</div>
        </div>
      </div>
    </div>
  );
}

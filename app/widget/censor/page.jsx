'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';

export default function BrbWidget() {
  const { wsData } = useWebSocket();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'CENSOR') {
      setIsVisible(!isVisible);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return (
    <div className="w-[1920px] h-[1080px] glassmorphism"></div>
  );
}

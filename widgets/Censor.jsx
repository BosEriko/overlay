'use client';
import { useEffect, useState } from 'react';
import Screen from '@components/Screen';

export default function CensorWidget({ wsData }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'CENSOR') {
      setIsVisible((prev) => !prev);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return (
    <Screen>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <video
          className="w-full h-full object-cover"
          src="/videos/censor.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </Screen>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';

// Sound map
const SOUND_IDS = [
  'BOO',
  'GOTTEM',
  'HELLO',
  'JOKE',
  'NICE_TRY',
  'PROFANITY',
];

export default function SoundWidget() {
  const { wsData } = useWebSocket();
  const audioRefs = useRef({});

  // Preload all sounds once
  useEffect(() => {
    SOUND_IDS.forEach((id) => {
      const audio = new Audio(`/sounds/alert/${id}.m4a`);
      audio.preload = 'auto';
      audio.load();
      audioRefs.current[id] = audio;
    });
  }, []);

  // Play sound when alert received
  useEffect(() => {
    if (wsData?.type === 'SOUND_ALERT' && wsData.id) {
      const audio = audioRefs.current[wsData.id];
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch((err) =>
          console.warn(`🔇 Couldn't play ${wsData.id}:`, err)
        );
      } else {
        console.warn(`🚫 Unknown sound ID: ${wsData.id}`);
      }
    }
  }, [wsData]);

  return (
    <div className="h-[1080px] w-[1920px]"></div>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import Screen from '@components/Screen';

// Music map
const MUSIC_IDS = [
  'JEREMY_BLAKE_POWERUP',
  'THE_GRAND_AFFAIR_COUPE',
];

export default function MusicWidget({ wsData }) {
  const audioRefs = useRef({});

  // Preload all music once
  useEffect(() => {
    MUSIC_IDS.forEach((id) => {
      const audio = new Audio(`/sounds/music/${id}.mp3`);
      audio.preload = 'auto';
      audio.loop = true;
      audio.load();
      audioRefs.current[id] = audio;
    });
  }, []);

  // Play music when alert received
  useEffect(() => {
    if (wsData?.type === 'MUSIC' && wsData.id) {
      const audio = audioRefs.current[wsData.id];

      if (!audio) {
        console.warn(`🚫 Unknown music ID: ${wsData.id}`);
        return;
      }

      if (wsData.isVisible) {
        // Stop all others first
        Object.entries(audioRefs.current).forEach(([id, a]) => {
          if (id !== wsData.id) {
            a.pause();
            a.currentTime = 0;
          }
        });

        // Play selected
        audio.currentTime = 0;
        audio.play().catch((err) =>
          console.warn(`🔇 Couldn't play ${wsData.id}:`, err)
        );
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }, [wsData]);

  return (
    <Screen />
  );
}

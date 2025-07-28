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
  const fadeIntervals = useRef({});

  // Preload all music once
  useEffect(() => {
    MUSIC_IDS.forEach((id) => {
      const audio = new Audio(`/sounds/music/${id}.mp3`);
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = 1;
      audio.load();
      audioRefs.current[id] = audio;
    });
  }, []);

  // Play music when alert received
  useEffect(() => {
    if (wsData?.type === 'MUSIC') {
      const fadeOut = (audio) => {
        clearInterval(fadeIntervals.current[audio.src]);
        fadeIntervals.current[audio.src] = setInterval(() => {
          if (audio.volume > 0.05) {
            audio.volume = Math.max(0, audio.volume - 0.05);
          } else {
            audio.volume = 0;
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fadeIntervals.current[audio.src]);
          }
        }, 100);
      };

      const fadeIn = (audio) => {
        clearInterval(fadeIntervals.current[audio.src]);
        audio.volume = 0;
        audio.currentTime = 0;
        audio.play().catch((err) =>
          console.warn(`🔇 Couldn't play:`, err)
        );
        fadeIntervals.current[audio.src] = setInterval(() => {
          if (audio.volume < 0.95) {
            audio.volume = Math.min(1, audio.volume + 0.05);
          } else {
            audio.volume = 1;
            clearInterval(fadeIntervals.current[audio.src]);
          }
        }, 100);
      };

      if (!wsData.id || !wsData.isVisible) {
        Object.values(audioRefs.current).forEach((audio) => {
          fadeOut(audio);
        });
        return;
      }

      const audio = audioRefs.current[wsData.id];

      if (!audio) {
        console.warn(`🚫 Unknown music ID: ${wsData.id}`);
        return;
      }

      Object.entries(audioRefs.current).forEach(([id, a]) => {
        if (id !== wsData.id) {
          fadeOut(a);
        }
      });

      fadeIn(audio);
    }
  }, [wsData]);

  return <Screen />;
}

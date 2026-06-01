'use client';
import { useEffect, useState, useRef } from 'react';
import Ticker from '@components/Ticker';
import Screen from '@components/Screen';

// Music map
const MUSIC_IDS = [
  'JEREMY_BLAKE_POWERUP',
  'THE_GRAND_AFFAIR_COUPE',
];

export default function ScreensaverWidget({ wsData }) {
  const audioRefs = useRef({});
  const fadeIntervals = useRef({});

  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

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

  useEffect(() => {
    if (wsData?.type === 'SCREENSAVER') {
      setMessage(wsData.ticker.message);
      setIsVisible(wsData.ticker.isVisible);

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

      if (!wsData.music.id || !wsData.music.isPlaying) {
        Object.values(audioRefs.current).forEach((audio) => {
          fadeOut(audio);
        });
        return;
      }

      const audio = audioRefs.current[wsData.music.id];

      if (!audio) {
        console.warn(`🚫 Unknown music ID: ${wsData.music.id}`);
        return;
      }

      Object.entries(audioRefs.current).forEach(([id, a]) => {
        if (id !== wsData.music.id) {
          fadeOut(a);
        }
      });

      fadeIn(audio);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return (
    <Screen>
      <Ticker message={message} />
    </Screen>
  );
}

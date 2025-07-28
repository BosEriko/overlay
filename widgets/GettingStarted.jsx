'use client';
import { useEffect, useRef, useState } from 'react';
import Ticker from '@components/Ticker';
import Screen from '@components/Screen';

const COUNTDOWN_SCHEDULE = [1, 2, 3, 4, 5];
const COUNTDOWN_START = 15;
const COUNTDOWN_DURATION = 1;

const MUSIC_ID = 'KEVIN_MACLEOD_8BIT_DUNGEON_BOSS';

export default function GettingStartedWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(`/sounds/music/${MUSIC_ID}.mp3`);
    audio.loop = true;
    audio.preload = 'auto';
    audio.load();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = now.getHours();

      const isScheduledDay = COUNTDOWN_SCHEDULE.includes(currentDay);
      const isWithinTime = currentHour >= COUNTDOWN_START && currentHour < COUNTDOWN_START + COUNTDOWN_DURATION;

      setIsVisible(isScheduledDay && isWithinTime);
    };

    checkTime();
    const interval = setInterval(checkTime, 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isVisible) {
      audio.currentTime = 0;
      audio
        .play()
        .catch((err) =>
          console.warn(`🔇 Couldn't play ${MUSIC_ID}:`, err)
        );
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Screen>
      <Ticker message="Getting Started" />
    </Screen>
  );
}

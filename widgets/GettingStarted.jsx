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
  const fadeIntervalRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(`/sounds/music/${MUSIC_ID}.mp3`);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1;
    audio.load();
    audioRef.current = audio;

    return () => {
      clearInterval(fadeIntervalRef.current);
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

    clearInterval(fadeIntervalRef.current);

    if (isVisible) {
      audio.volume = 0;
      audio.currentTime = 0;
      audio.play().catch((err) =>
        console.warn(`🔇 Couldn't play ${MUSIC_ID}:`, err)
      );
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume < 0.95) {
          audio.volume = Math.min(1, audio.volume + 0.05);
        } else {
          audio.volume = 1;
          clearInterval(fadeIntervalRef.current);
        }
      }, 100);
    } else {
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.05);
        } else {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          clearInterval(fadeIntervalRef.current);
        }
      }, 100);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <Screen>
      <Ticker message="Getting Started" />
    </Screen>
  );
}

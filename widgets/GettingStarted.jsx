'use client';
import { useEffect, useRef, useState } from 'react';
import env from "@utilities/env";
import Ticker from '@components/Ticker';
import Screen from '@components/Screen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const COUNTDOWN_SCHEDULE = env.stream.days.split(',').map((day) => ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].indexOf(day));
const COUNTDOWN_START = Number(env.stream.start) - 1;
const COUNTDOWN_DURATION = 1;

const MUSIC_ID = 'KEVIN_MACLEOD_8BIT_DUNGEON_BOSS';

export default function GettingStartedWidget() {
  const [isVisible, setIsVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const audioRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    const audio = new Audio(`/sounds/music/${MUSIC_ID}.mp3`);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 1;
    audio.load();
    audioRef.current = audio;

    return () => {
      clearInterval(fadeIntervalRef.current);
      clearInterval(countdownIntervalRef.current);
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

      if (isScheduledDay && isWithinTime) {
        const end = new Date();
        end.setHours(COUNTDOWN_START + COUNTDOWN_DURATION, 0, 0, 0);
        const diff = Math.floor((end - now) / 1000);
        setRemainingTime(diff);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setRemainingTime(0);
      }
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

  useEffect(() => {
    clearInterval(countdownIntervalRef.current);

    if (isVisible && remainingTime > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setRemainingTime((t) => {
          if (t <= 1) {
            setIsVisible(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }

    return () => clearInterval(countdownIntervalRef.current);
  }, [isVisible, remainingTime]);

  if (!isVisible) return null;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <Screen>
      <div className="relative z-50 w-full h-full">
        <div className="z-10">
          <Ticker message="Getting Started" />
        </div>
        <div className="absolute top-0 left-0 w-[1920px] h-[1080px] flex items-center justify-center text-4xl font-bold z-20">
          <div className={`${pixelify.className} text-yellow-700 bg-yellow-300 px-10 py-5 w-[470px] text-center border border-yellow-700 border-[10px] rounded-[25px] flex items-baseline justify-center gap-[30px]`}>
            <div className="text-[75px]"><FontAwesomeIcon icon={faClock} /></div>
            <div className="flex-1 text-[100px]">{minutes}:{seconds.toString().padStart(2, '0')}</div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

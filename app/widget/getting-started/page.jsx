'use client';
import { useEffect, useState } from 'react';
import Ticker from '@components/Ticker';

const COUNTDOWN_SCHEDULE = [1, 2, 3, 4, 5];
const COUNTDOWN_START = 15;
const COUNTDOWN_DURATION = 1;

export default function GettingStartedWidget() {
  const [isVisible, setIsVisible] = useState(false);

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

  if (!isVisible) return null;

  return <Ticker message="Getting Started" />;
}

'use client';
import { useEffect, useState } from 'react';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const START_TIME = 16;
const DURATION = 4;
const START_DAY = 1;
const END_DAY = 5;

export default function StartingScene() {
  const [displayText, setDisplayText] = useState('');
  const [isWeekday, setIsWeekday] = useState(true);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const weekday = day >= START_DAY && day <= END_DAY;
    setIsWeekday(weekday);

    if (!weekday) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const startTime = START_TIME;
      const endTime = START_TIME + DURATION;

      if (currentHour >= endTime || currentHour < startTime) {
        let target = new Date();
        target.setHours(startTime, 0, 0, 0);

        if (now >= target) {
          target.setDate(target.getDate() + 1);
        }

        const diff = target.getTime() - now.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setDisplayText(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setDisplayText('Get ready!');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isWeekday) {
    setDisplayText('Weekends are for rest and relaxation!');
  };

  return (
    <div className={`${pixelify.className} w-[1920px] h-[1080px] flex flex-col items-center justify-center bg-yellow-300 background-pattern`}>
      <div className="text-[100px] p-2 text-yellow-800 -mb-20">Starting Soon</div>
      <div className="text-[200px] p-2 text-yellow-800">{displayText}</div>
    </div>
  );
};

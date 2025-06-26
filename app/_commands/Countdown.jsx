'use client';
import React, { useEffect, useState } from 'react';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const Countdown = () => {
  const [displayText, setDisplayText] = useState('');
  const [isWeekday, setIsWeekday] = useState(true);

  useEffect(() => {
    const now = new Date();
    const day = now.getDay();
    const weekday = day >= 1 && day <= 5;
    setIsWeekday(weekday);

    if (!weekday) return;

    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 0 && currentHour < 20) {
        const target = new Date();
        target.setHours(20, 0, 0, 0);

        const diff = target.getTime() - now.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        setDisplayText(
          `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        );
      } else {
        setDisplayText('Raid Time');
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isWeekday) return null;

  return (
    <div className={`${pixelify.className} bg-yellow-300 rounded-full overflow-hidden shadow-xl text-center`}>
      <div className="text-white text-yellow-800 text-4xl flex items-center justify-center gap-3">
        <img src="https://imgur.com/6koyRAU.png" className="w-15 h-15 bg-white rounded-full border-yellow-300 border-5" />
        <div className="pr-5">{displayText}</div>
      </div>
    </div>
  );
};

export default Countdown;

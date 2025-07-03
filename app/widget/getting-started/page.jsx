'use client';
import { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const COUNTDOWN_SCHEDULE = [1, 2, 3, 4, 5];
const COUNTDOWN_START = 15;
const COUNTDOWN_DURATION = 1;

const profileImage = (
  <img src="/images/profile.png" alt="Profile" className="w-30 h-30" />
);

function generateSequence(message, repeat = 7) {
  const items = [];
  for (let i = 0; i < repeat; i++) {
    items.push(
      <div key={`img-${i}`}>{profileImage}</div>,
      <div key={`msg-${i}`}>{message}</div>
    );
  }
  return items;
}

function MarqueeRow({ message, direction }) {
  return (
    <Marquee direction={direction} gradient={false} speed={50}>
      <div className="text-[100px] h-[150px] flex gap-[20px] items-center uppercase mr-[20px]">
        {generateSequence(message)}
      </div>
    </Marquee>
  );
}

export default function BrbWidget() {
  const [message] = useState('Getting Started');
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

  return (
    <div className={`${pixelify.className} relative w-[1920px] h-[1080px] bg-yellow-300 overflow-hidden text-yellow-700`}>
      <div
        className="absolute -left-[500px] -top-[500px] w-[3000px] h-[3000px] rotate-[20deg] scale-[1.2]"
        style={{
          transformOrigin: 'center',
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="mb-[40px]">
            <MarqueeRow
              message={message}
              direction={i % 2 === 0 ? 'left' : 'right'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

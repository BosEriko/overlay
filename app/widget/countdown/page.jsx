'use client';
import { useEffect, useState } from 'react';
import { Pixelify_Sans } from 'next/font/google';
import env from '../../_utilities/env';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const STREAM_SCHEDULE = [1, 2, 3, 4, 5];
const STREAM_START = 20;
const STREAM_DURATION = 4;
const STREAM_USERNAME = 'TwisWua';

export default function CountdownWidget() {
  const [displayText, setDisplayText] = useState('');
  const [streamIcon, setStreamIcon] = useState('');

  useEffect(() => {
    const fetchTwitchDetails = async () => {
      try {
        const res = await fetch(`${env.server}/api/details?username=${STREAM_USERNAME}`);
        const data = await res.json();
        if (data?.profile_image_url) {
          setStreamIcon(data.profile_image_url);
        }
      } catch (err) {
        console.error('Failed to fetch Twitch details:', err);
      }
    };

    fetchTwitchDetails();
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();

      if (!STREAM_SCHEDULE.includes(day)) {
        setDisplayText('');
        return;
      }

      const streamEnd = (STREAM_START + STREAM_DURATION) % 24;
      const isRaidTime = STREAM_START < streamEnd ? hour >= STREAM_START && hour < streamEnd : hour >= STREAM_START || hour < streamEnd;

      if (isRaidTime) {
        setDisplayText('Raid Time');
        return;
      }

      const target = new Date();
      if (hour >= STREAM_START) {
        target.setDate(target.getDate() + 1);
      }
      target.setHours(STREAM_START, 0, 0, 0);

      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setDisplayText(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (displayText === '') return null;

  return (
    <div className="h-[1080px] w-[1920px] relative">
      <div className="absolute left-[17px] top-[66px]">
        <div className={`${pixelify.className} bg-yellow-300 rounded-full overflow-hidden shadow-xl text-center border-[5px] border-yellow-500`} style={{ borderRadius: '10px' }}>
          <div className="text-yellow-800 text-4xl flex items-center justify-center gap-3">
            {streamIcon && (
              <img
                src={streamIcon}
                alt="Streamer Icon"
                className="w-15 h-15 bg-white rounded-full border-yellow-300 border-5"
                style={{ borderRadius: '10px' }}
              />
            )}
            <div className="pr-5">{displayText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
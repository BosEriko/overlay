'use client';
import { useEffect, useState } from 'react';
import { Pixelify_Sans } from 'next/font/google';
import Screen from '@components/Screen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700'],
});

export default function PlayerWidget({ wsData }) {
  const [musicDetail, setMusicDetail] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (wsData?.type === 'MUSIC_DETAIL') {
      setMusicDetail(wsData.musicDetails);
    }
  }, [wsData]);

  useEffect(() => {
    if (!musicDetail) return;

    setProgress((musicDetail.currentTime / musicDetail.length) * 100);

    let animationFrame;
    let startTime = Date.now();

    const tick = () => {
      if (musicDetail.isPlaying) {
        const elapsed = Date.now() - startTime;
        const current = Math.min(
          musicDetail.currentTime + elapsed,
          musicDetail.length
        );
        setProgress((current / musicDetail.length) * 100);
        animationFrame = requestAnimationFrame(tick);
      }
    };

    animationFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame);
  }, [musicDetail]);

  if (!musicDetail) return null;

  return (
    <Screen>
      <div className="absolute left-[17px] top-[143px]">
        <div className="flex items-center gap-4 p-1 bg-yellow-300 rounded-[10px] shadow-xl mx-auto border-[5px] border-yellow-500">
          <img
            src={musicDetail.albumCoverUrl}
            alt={musicDetail.title}
            className="w-20 h-20 rounded-[5px] object-cover shadow-md"
          />
          <div className="flex flex-col flex-1">
            <h2 className={`${pixelify.className} text-2xl font-bold text-yellow-800 truncate w-[200px]`}>
              {musicDetail.title}
            </h2>
            <p className="text-sm truncate text-yellow-700 font-bold truncate w-[200px]">
              {musicDetail.singer}
            </p>
            <div className="w-full h-2 bg-yellow-400 rounded-full mt-2 overflow-hidden">
              <div
                className="h-2 bg-yellow-800 transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-800 transition mr-1">
            <FontAwesomeIcon
              icon={musicDetail.isPlaying ? faPause : faPlay}
              className="text-yellow-300 w-5 h-5"
            />
          </button>
        </div>
      </div>
    </Screen>
  );
}

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

  useEffect(() => {
    if (wsData?.type === 'MUSIC_DETAIL') {
      setMusicDetail(wsData.musicDetails);
    }
  }, [wsData]);

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
            <p className="text-sm text-yellow-700 font-bold truncate w-[200px]">
              {musicDetail.singer}
            </p>

            <div className="w-full h-2 bg-yellow-400 rounded-full mt-2 overflow-hidden">
              <div
                className="h-2 bg-yellow-800 transition-all duration-200 ease-linear"
                style={{ width: `${musicDetail.progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-yellow-700 font-bold mt-1">
              <span>{musicDetail.currentTime}</span>
              <span>{musicDetail.length}</span>
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

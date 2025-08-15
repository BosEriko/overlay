'use client';
import { useEffect, useState, useRef } from 'react';
import { Pixelify_Sans } from 'next/font/google';
import { useWebSocket } from '@hooks/useWebsocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faClock, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700'],
});

export default function MusicQueuePublic() {
  const [musicQueue, setMusicQueue] = useState([]);
  const [musicDetail, setMusicDetail] = useState(null);
  const { wsData } = useWebSocket();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!wsData) return;

    if (wsData?.type === 'MUSIC_QUEUE') {
      setMusicQueue(wsData.musicQueue || []);
    }

    if (wsData?.type === 'MUSIC_DETAIL') {
      setMusicDetail(wsData.musicDetails || null);
    }
  }, [wsData]);

  // Smooth progress updater
  useEffect(() => {
    if (!musicDetail) return;

    clearInterval(intervalRef.current);

    if (musicDetail.isPlaying) {
      intervalRef.current = setInterval(() => {
        setMusicDetail(prev => {
          if (!prev) return prev;

          const [cm, cs] = prev.currentTime.split(':').map(Number);
          const [lm, ls] = prev.length.split(':').map(Number);

          const currentSec = cm * 60 + cs + 1;
          const lengthSec = lm * 60 + ls;

          if (currentSec >= lengthSec) {
            return { ...prev, currentTime: prev.length, progress: 100 };
          }

          const mm = Math.floor(currentSec / 60);
          const ss = String(currentSec % 60).padStart(2, '0');

          return {
            ...prev,
            currentTime: `${mm}:${ss}`,
            progress: (currentSec / lengthSec) * 100,
          };
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [musicDetail?.isPlaying]);

  useEffect(() => {
    if (musicDetail) {
      document.title = `🎵 Now Playing: ${musicDetail.title} - ${musicDetail.singer}`;
    } else {
      document.title = 'Music Player Queue';
    }
  }, [musicDetail]);

  // sort oldest first
  const sortedQueue = [...musicQueue].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Group by status
  const queued = sortedQueue.filter((item) => item.status === 'QUEUED');
  const completed = sortedQueue.filter((item) => item.status === 'COMPLETED');

  const SongCard = ({ item }) => {
    let statusLabel = '';
    let statusIcon = null;

    switch (item.status) {
      case 'COMPLETED':
        statusIcon = faCheck;
        statusLabel = 'Played';
        break;
      default: // QUEUED
        statusIcon = faClock;
        statusLabel = 'Pending';
    }

    return (
      <div className="flex items-center gap-4 p-3 bg-yellow-300 rounded-[10px] shadow-xl border-[4px] border-yellow-500">
        {/* Album Cover */}
        <img
          src={item.music.albumCoverUrl}
          alt={item.music.title}
          className="w-16 h-16 rounded-[5px] object-cover border-[3px] border-yellow-500 bg-yellow-500"
        />

        {/* Song Info */}
        <div className="flex-1">
          <p className={`${pixelify.className} font-bold text-yellow-900 truncate`}>
            {item.music.title}
          </p>
          <p className="text-yellow-700 text-sm font-bold truncate">
            {item.music.singer}
          </p>
          <p className="text-yellow-600 text-xs">{item.music.length}</p>
          <p className="text-yellow-800 text-xs italic">Added by {item.username}</p>
        </div>

        {/* Status */}
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-800 text-yellow-200">
          <FontAwesomeIcon icon={statusIcon} />
          {statusLabel}
        </span>

        {/* Spotify Link */}
        {item.music.spotifyUrl && (
          <a
            href={item.music.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-500 ml-2"
          >
            <FontAwesomeIcon icon={faSpotify} size="lg" />
          </a>
        )}
      </div>
    );
  };

  const NowPlayingCard = ({ detail }) => (
    <div className="flex items-center gap-4 p-3 bg-yellow-300 rounded-[10px] shadow-xl border-[5px] border-yellow-500">
      {/* Album Cover */}
      <img
        src={detail.albumCoverUrl}
        alt={detail.title}
        className="w-20 h-20 rounded-[5px] object-cover border-[3px] border-yellow-500 bg-yellow-500"
      />

      {/* Song Info + Progress */}
      <div className="flex flex-col flex-1">
        <p className={`${pixelify.className} text-xl font-bold text-yellow-900 truncate`}>
          {detail.title}
        </p>
        <p className="text-sm text-yellow-700 font-bold truncate">{detail.singer}</p>

        <div className="w-full h-2 bg-yellow-400 rounded-full mt-2 overflow-hidden">
          <div
            className="h-2 bg-yellow-800 transition-all duration-500 ease-linear"
            style={{ width: `${detail.progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-yellow-700 font-bold mt-1">
          <span>{detail.currentTime}</span>
          <span>{detail.length}</span>
        </div>
      </div>

      {/* Controls + Spotify */}
      <div className="flex flex-col items-center gap-2">
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-yellow-800 text-yellow-200">
          <FontAwesomeIcon icon={detail.isPlaying ? faPlay : faPause} />
          {detail.isPlaying ? 'Playing' : 'Paused'}
        </span>

        {detail.spotifyUrl && (
          <a
            href={detail.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-500"
          >
            <FontAwesomeIcon icon={faSpotify} size="lg" />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="container mx-auto p-4 space-y-6">
        {/* Playing */}
        <section>
          <h2 className={`${pixelify.className} text-xl font-bold text-yellow-900 mb-3 drop-shadow-[1px_1px_2px_white]`}>
            🎵 Now Playing
          </h2>
          <div className="space-y-3">
            {!musicDetail ? (
              <p className="text-yellow-700 italic">No song is playing right now.</p>
            ) : (
              <NowPlayingCard detail={musicDetail} />
            )}
          </div>
        </section>

        {/* Pending */}
        <section>
          <h2 className={`${pixelify.className} text-xl font-bold text-yellow-900 mb-3 drop-shadow-[1px_1px_2px_white]`}>
            ⏳ Pending Songs
          </h2>
          <div className="space-y-3">
            {queued.length === 0 ? (
              <p className="text-yellow-700 italic">No pending songs.</p>
            ) : (
              queued.map((item, idx) => (
                <SongCard key={`${item.id}-${idx}`} item={item} />
              ))
            )}
          </div>
        </section>

        {/* Played */}
        <section>
          <h2 className={`${pixelify.className} text-xl font-bold text-yellow-900 mb-3 drop-shadow-[1px_1px_2px_white]`}>
            ✅ Played Songs
          </h2>
          <div className="space-y-3">
            {completed.length === 0 ? (
              <p className="text-yellow-700 italic">No songs played yet.</p>
            ) : (
              completed.map((item, idx) => (
                <SongCard key={`${item.id}-${idx}`} item={item} />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useState, useRef } from 'react';
import { useWebSocket } from '@hooks/useWebsocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faClock, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

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
    let statusStyle = '';
    let statusIcon = null;
    let statusLabel = '';

    switch (item.status) {
      case 'COMPLETED':
        statusStyle = 'bg-green-700 text-green-200';
        statusIcon = faCheck;
        statusLabel = 'Played';
        break;
      default: // QUEUED
        statusStyle = 'bg-yellow-700 text-yellow-200';
        statusIcon = faClock;
        statusLabel = 'Pending';
    }

    return (
      <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-2xl shadow-md">
        {/* Album Cover */}
        <img
          src={item.music.albumCoverUrl}
          alt={item.music.title}
          className="w-16 h-16 rounded-xl object-cover"
        />

        {/* Song Info */}
        <div className="flex-1">
          <p className="font-semibold text-white">{item.music.title}</p>
          <p className="text-gray-300 text-sm">{item.music.singer}</p>
          <p className="text-gray-500 text-xs">{item.music.length}</p>
          <p className="text-gray-400 text-xs italic">Added by {item.username}</p>
        </div>

        {/* Status */}
        <span
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusStyle}`}
        >
          <FontAwesomeIcon icon={statusIcon} />
          {statusLabel}
        </span>

        {/* Spotify Link */}
        {item.music.spotifyUrl && (
          <a
            href={item.music.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            <FontAwesomeIcon icon={faSpotify} size="lg" />
          </a>
        )}
      </div>
    );
  };

  const NowPlayingCard = ({ detail }) => (
    <div className="flex items-center gap-4 p-3 bg-gray-800 rounded-2xl shadow-md">
      {/* Album Cover */}
      <img
        src={detail.albumCoverUrl}
        alt={detail.title}
        className="w-20 h-20 rounded-xl object-cover"
      />

      {/* Song Info + Progress */}
      <div className="flex flex-col flex-1">
        <p className="font-semibold text-white text-lg truncate">{detail.title}</p>
        <p className="text-gray-300 text-sm truncate">{detail.singer}</p>

        <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all duration-500 ease-linear"
            style={{ width: `${detail.progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{detail.currentTime}</span>
          <span>{detail.length}</span>
        </div>
      </div>

      {/* Controls + Spotify */}
      <div className="flex flex-col items-center gap-2">
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-700 text-blue-200">
          <FontAwesomeIcon icon={detail.isPlaying ? faPlay : faPause} />
          {detail.isPlaying ? 'Playing' : 'Paused'}
        </span>

        {detail.spotifyUrl && (
          <a
            href={detail.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:text-green-300"
          >
            <FontAwesomeIcon icon={faSpotify} size="lg" />
          </a>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 space-y-6">
      {/* Playing */}
      <section>
        <h2 className="text-xl font-bold mb-3">🎵 Now Playing</h2>
        <div className="space-y-3">
          {!musicDetail ? (
            <p className="text-gray-400">No song is playing right now.</p>
          ) : (
            <NowPlayingCard detail={musicDetail} />
          )}
        </div>
      </section>

      {/* Pending */}
      <section>
        <h2 className="text-xl font-bold mb-3">⏳ Pending Songs</h2>
        <div className="space-y-3">
          {queued.length === 0 ? (
            <p className="text-gray-400">No pending songs.</p>
          ) : (
            queued.map((item, idx) => (
              <SongCard key={`${item.id}-${idx}`} item={item} />
            ))
          )}
        </div>
      </section>

      {/* Played */}
      <section>
        <h2 className="text-xl font-bold mb-3">✅ Played Songs</h2>
        <div className="space-y-3">
          {completed.length === 0 ? (
            <p className="text-gray-400">No songs played yet.</p>
          ) : (
            completed.map((item, idx) => (
              <SongCard key={`${item.id}-${idx}`} item={item} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

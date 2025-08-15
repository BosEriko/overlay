'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '@hooks/useWebsocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faClock, faPlay } from '@fortawesome/free-solid-svg-icons';

export default function MusicQueuePublic() {
  const [musicQueue, setMusicQueue] = useState([]);
  const { wsData } = useWebSocket();

  useEffect(() => {
    if (!wsData) return;
    if (wsData?.type === 'MUSIC_QUEUE') {
      setMusicQueue(wsData.musicQueue || []);
    }
  }, [wsData]);

  // sort oldest first
  const sortedQueue = [...musicQueue].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Group by status
  const playing = sortedQueue.filter((item) => item.status === 'PLAYING');
  const queued = sortedQueue.filter((item) => item.status === 'QUEUED');
  const completed = sortedQueue.filter((item) => item.status === 'COMPLETED');

  const SongCard = ({ item }) => {
    let statusStyle = '';
    let statusIcon = null;
    let statusLabel = '';

    switch (item.status) {
      case 'PLAYING':
        statusStyle = 'bg-blue-700 text-blue-200';
        statusIcon = faPlay;
        statusLabel = 'Playing';
        break;
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

  return (
    <div className="p-4 space-y-6">
      {/* Playing */}
      <section>
        <h2 className="text-xl font-bold mb-3">🎵 Now Playing</h2>
        <div className="space-y-3">
          {playing.length === 0 ? (
            <p className="text-gray-400">No song from queue is playing right now.</p>
          ) : (
            playing.map((item, idx) => (
              <SongCard key={`${item.id}-${idx}`} item={item} />
            ))
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

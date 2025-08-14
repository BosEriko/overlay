'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '@hooks/useWebsocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faCheck, faClock } from '@fortawesome/free-solid-svg-icons';

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

  const pending = sortedQueue.filter((item) => !item.has_played);
  const played = sortedQueue.filter((item) => item.has_played);

  const SongCard = ({ item }) => (
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
        className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          item.has_played
            ? 'bg-green-700 text-green-200'
            : 'bg-yellow-700 text-yellow-200'
        }`}
      >
        <FontAwesomeIcon icon={item.has_played ? faCheck : faClock} />
        {item.has_played ? 'Played' : 'Pending'}
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

  return (
    <div className="p-4 space-y-6">
      {/* Pending List */}
      <section>
        <h2 className="text-xl font-bold mb-3">⏳ Pending Songs</h2>
        <div className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-gray-400">No pending songs.</p>
          ) : (
            pending.map((item, idx) => (
              <SongCard key={`${item.id}-${idx}`} item={item} />
            ))
          )}
        </div>
      </section>

      {/* Played List */}
      <section>
        <h2 className="text-xl font-bold mb-3">✅ Played Songs</h2>
        <div className="space-y-3">
          {played.length === 0 ? (
            <p className="text-gray-400">No songs played yet.</p>
          ) : (
            played.map((item, idx) => (
              <SongCard key={`${item.id}-${idx}`} item={item} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

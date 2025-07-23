'use client';
import { useEffect, useRef, useState } from 'react';
import Screen from '@components/Screen';

export default function MusicWidget({ wsData }) {
  const [videoId, setVideoId] = useState(null);
  const [visible, setVisible] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    if (wsData?.type === 'MUSIC') {
      if (wsData.id && wsData.isVisible) {
        setVideoId(wsData.id);
        setVisible(true);
      } else {
        setVideoId(null);
        setVisible(false);
        if (playerRef.current) {
          playerRef.current.stopVideo?.();
        }
      }
    }
  }, [wsData]);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      if (videoId && !playerRef.current) {
        playerRef.current = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: videoId,
          events: {
            onReady: event => event.target.playVideo(),
          },
        });
      }
    };

    if (window.YT && window.YT.Player && videoId) {
      if (playerRef.current) {
        playerRef.current.loadVideoById(videoId);
      } else {
        playerRef.current = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: videoId,
          events: {
            onReady: event => event.target.playVideo(),
          },
        });
      }
    }
  }, [videoId]);

  return (
    <Screen>
      {visible && (
        <div style={{ display: 'none' }}>
          <div id="yt-player"></div>
        </div>
      )}
    </Screen>
  );
}

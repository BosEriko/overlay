'use client';

import { useEffect } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import toast, { Toaster } from 'react-hot-toast';

const ping = typeof Audio !== 'undefined' ? new Audio('/sounds/notification.m4a') : null;
if (ping) {
  ping.preload = 'auto';
  ping.load();
}

function playSound() {
  if (!ping) return;
  ping.currentTime = 0;
  ping.play().catch((err) => {
    console.warn('🔇 Audio play blocked:', err);
  });
}

function showToast({ type, message, username }) {
  const baseStyle = 'max-w-sm w-full rounded-2xl shadow-xl p-4 border-l-4 animate-slide-in pointer-events-auto';
  const position = 'bottom-left';
  const duration = 5000;

  if (type === 'event') {
    playSound();
    toast.custom(
      <div className={`${baseStyle} bg-black border-yellow-500`}>
        <p className="text-white text-sm">{message}</p>
      </div>,
      { position, duration }
    );
  }

  if (type === 'chat') {
    toast.custom(
      <div className={`${baseStyle} bg-zinc-900 border-blue-500`}>
        <p className="text-yellow-400 font-semibold text-sm">{username}</p>
        <p className="text-white text-sm">{message}</p>
      </div>,
      { position, duration }
    );
  }
}

export default function FeedWidget() {
  const { wsData } = useWebSocket();

  useEffect(() => {
    if (wsData?.type === 'FEED') {
      showToast({
        type: wsData.feed_type,
        message: wsData.message,
        username: wsData.username,
      });
    }
  }, [wsData]);

  return (
    <div className="relative pointer-events-none h-[1080px] w-[1920px]">
      <Toaster />
    </div>
  );
}

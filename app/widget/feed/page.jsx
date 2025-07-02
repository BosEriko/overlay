'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import toast, { Toaster } from 'react-hot-toast';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

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

function ToastContent({ children, className = "" }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setExiting(true), 4700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`${exiting ? 'animate-slide-out' : 'animate-slide-in'} ${pixelify.className} ${className} max-w-sm w-full shadow-xl py-2 px-3 pointer-events-auto border-[5px] text-xl rounded-2xl`}
    >
      {children}
    </div>
  );
}

function showToast({
  type,
  message,
  username,
}) {
  const position = 'bottom-left';
  const duration = 5000;

  if (type === 'event') {
    playSound();
    toast.custom(
      () => (
        <ToastContent className="border-yellow-500 bg-yellow-300 text-yellow-800">
          <p>{message}</p>
        </ToastContent>
      ),
      { position, duration }
    );
  }

  if (type === 'chat') {
    toast.custom(
      () => (
        <ToastContent className="border-yellow-500 bg-yellow-300 text-yellow-800">
          <p className="font-bold text-yellow-700">{username}</p>
          <p>{message}</p>
        </ToastContent>
      ),
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

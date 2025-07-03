'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import toast, { Toaster } from 'react-hot-toast';
import { Pixelify_Sans } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faStar } from '@fortawesome/free-solid-svg-icons';

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

function ToastContent({ children, className = '' }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setExiting(true), 4700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={`${exiting ? 'animate-slide-out' : 'animate-slide-in'} ${pixelify.className} ${className} max-w-sm w-full shadow-xl py-2 px-3 pointer-events-auto border-[5px] text-xl rounded-2xl mb-[2px]`}
    >
      {children}
    </div>
  );
}

const toastQueue = [];
const MAX_TOASTS = 5;

// Define gradients and associated text/icon colors
const pastelThemes = [
  { gradient: 'from-pink-200 to-purple-200', textColor: 'text-purple-800', iconColor: 'text-purple-700' },
  { gradient: 'from-green-200 to-teal-200', textColor: 'text-teal-900', iconColor: 'text-teal-800' },
  { gradient: 'from-blue-200 to-indigo-200', textColor: 'text-indigo-900', iconColor: 'text-indigo-800' },
  { gradient: 'from-yellow-200 to-pink-200', textColor: 'text-pink-900', iconColor: 'text-pink-800' },
  { gradient: 'from-rose-200 to-orange-200', textColor: 'text-orange-900', iconColor: 'text-orange-800' },
  { gradient: 'from-lime-200 to-cyan-200', textColor: 'text-cyan-900', iconColor: 'text-cyan-800' },
  { gradient: 'from-fuchsia-200 to-sky-200', textColor: 'text-fuchsia-900', iconColor: 'text-fuchsia-800' },
];

function showToast({ type, message, username }) {
  const position = 'bottom-left';
  const duration = 5000;

  if (toastQueue.length >= MAX_TOASTS) {
    const oldest = toastQueue.shift();
    if (oldest) toast.dismiss(oldest);
  }

  const isEvent = type === 'event';
  const icon = isEvent ? faStar : faComment;

  const theme = isEvent
    ? pastelThemes[Math.floor(Math.random() * pastelThemes.length)]
    : { gradient: '', textColor: 'text-yellow-800', iconColor: 'text-yellow-700' };

  const id = toast.custom(
    () => (
      <ToastContent
        className={
          isEvent
            ? `bg-gradient-to-br ${theme.gradient} ${theme.textColor} border-white`
            : 'border-yellow-500 bg-yellow-300 text-yellow-800'
        }
      >
        <div className="flex items-start gap-3 overflow-hidden">
          <FontAwesomeIcon
            icon={icon}
            className={`text-2xl shrink-0 mt-1 ${theme.iconColor}`}
          />
          <div>
            {type === 'chat' && <p className="font-bold text-yellow-700">{username}</p>}
            <p>{message}</p>
          </div>
        </div>
      </ToastContent>
    ),
    { position, duration }
  );

  toastQueue.push(id);
  if (isEvent) playSound();
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

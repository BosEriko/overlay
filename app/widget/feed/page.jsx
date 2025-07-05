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

function ToastContent({ children, className = '', type }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setExiting(true), 4700);
    return () => clearTimeout(timeout);
  }, []);

  const toastContentClassMap = {
    event: 'max-w-sm border-[5px] py-2 px-3',
    chat: 'max-w-sm border-[5px] py-2 px-3',
    shoutout: 'max-w-md border-[0px]',
  };

  return (
    <div className={`${exiting ? 'animate-slide-out' : 'animate-slide-in'} ${pixelify.className} ${className} ${toastContentClassMap[type]} w-full shadow-xl pointer-events-auto text-xl rounded-2xl mb-[2px] overflow-hidden`}>
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

function showToast({ type, message, username, user }) {
  const position = 'bottom-left';
  const duration = 5000;

  if (toastQueue.length >= MAX_TOASTS) {
    const oldest = toastQueue.shift();
    if (oldest) toast.dismiss(oldest);
  }

  const isEvent = type === 'event';
  const isChat = type === 'chat';
  const isShoutout = type === 'shoutout';

  const icon = isEvent ? faStar : faComment;
  const theme = isEvent ? pastelThemes[Math.floor(Math.random() * pastelThemes.length)] : { gradient: '', textColor: 'text-yellow-800', iconColor: 'text-yellow-700' };
  const toastClassMap = {
    event: `bg-gradient-to-br ${theme.gradient} ${theme.textColor} border-white`,
    chat: 'border-yellow-500 bg-yellow-300 text-yellow-800',
    shoutout: 'text-yellow-800 topography',
  };

  const id = toast.custom(
    () => (
      <ToastContent className={toastClassMap[type]} type={type}>
        { !isShoutout && <div className="flex items-start gap-3">
          <FontAwesomeIcon icon={icon} className={`text-2xl shrink-0 mt-1 ${theme.iconColor}`} />
          <div>
            {type === 'chat' && <p className="font-bold text-yellow-700">{username}</p>}
            <p>{message}</p>
          </div>
        </div> }
        { isShoutout && <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between pt-3 px-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><span className="text-yellow-800">BE</span></div>
            <div className="border border-white rounded-[100px] text-white py-1 px-2 text-sm capitalize" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>{user?.broadcaster_type}</div>
          </div>
          <div className="uppercase text-white font-bold text-2xl drop-shadow px-3">Bos Eriko University</div>
          <div className="flex gap-3 items-center px-3 mb-2">
            <div><img src={user?.profile_image_url} className="h-30 w-30 rounded-lg border-[5px] border-yellow-500"/></div>
            <div className="flex flex-col">
              <div className="font-bold text-2xl text-white drop-shadow">{user?.display_name}</div>
              <div className="flex gap-1 text-white drop-shadow">
                <div>ID:</div>
                <div>BE-{user?.id}</div>
              </div>
              <div className="flex gap-1 text-white drop-shadow">
                <div>Enrolled:</div>
                <div>{user?.created_at}</div>
              </div>
            </div>
          </div>
          <div style={{ backgroundColor: "rgba(0,0,0,0.25)" }} className="w-full py-2 px-4 text-sm flex justify-between items-center text-white">
            <div>twitch.tv/{user?.display_name}</div>
            <div>BE-{user?.id}</div>
          </div>
        </div> }
      </ToastContent>
    ),
    { position, duration }
  );

  toastQueue.push(id);
  if (!isChat) playSound();
}

export default function FeedWidget() {
  const { wsData } = useWebSocket();

  useEffect(() => {
    if (wsData?.type === 'FEED') {
      showToast({
        type: wsData.feed_type,
        message: wsData.message,
        username: wsData.username,
        user: wsData.user || {}
      });
    }
  }, [wsData]);

  return (
    <div className="relative pointer-events-none h-[1080px] w-[1920px]">
      <Toaster />
    </div>
  );
}

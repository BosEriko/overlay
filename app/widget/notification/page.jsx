'use client';

import { useEffect } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import {
  ToastContainer,
  toast as baseToast,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ping = typeof Audio !== 'undefined' ? new Audio('/sounds/notification.m4a') : null;

function toastWithStyle(message, eventType) {
  if (ping) {
    ping.currentTime = 0;
    ping.play();
  }

  const variantMap = {
    raided: 'success',
    cheer: 'info',
    subscription: 'success',
    resub: 'success',
    subgift: 'info',
    hosted: 'warning',
    follow: 'default',
  };

  const variant = variantMap[eventType] || 'default';

  const options = {
    position: 'bottom-left',
    autoClose: 5000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
    closeButton: false,
  };

  switch (variant) {
    case 'success':
      return baseToast.success(message, options);
    case 'info':
      return baseToast.info(message, options);
    case 'warning':
      return baseToast.warning(message, options);
    case 'error':
      return baseToast.error(message, options);
    default:
      return baseToast(message, options);
  }
}

export default function NotificationWidget() {
  const { wsData } = useWebSocket();

  useEffect(() => {
    if (wsData?.type === 'NOTIFICATION' && wsData.message) {
      toastWithStyle(wsData.message, wsData.event_type);
    }
  }, [wsData]);

  return (
    <div className="relative pointer-events-none h-[1080px] w-[1920px]">
      <ToastContainer closeButton={false} />
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../_hooks/useWebsocket';

export default function Flash() {
  const { wsData } = useWebSocket();
  const [message, setMessage] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!wsData) return;

    if (
      wsData.type === 'HELLO_COMMAND' ||
      wsData.type === 'BOOM_EFFECT' ||
      wsData.type === 'UPTIME_COMMAND'
    ) {
      const msg =
        wsData.type === 'HELLO_COMMAND'
          ? `👋 Hello from ${wsData.user}`
          : wsData.type === 'BOOM_EFFECT'
          ? `💥 BOOM triggered by ${wsData.user}`
          : `⏱️ Bot has been running since it started`;

      setMessage(msg);
      setVisible(true);

      const timeout = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [wsData]);

  if (!visible || !message) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      padding: '1rem',
      backgroundColor: '#333',
      color: 'white',
      borderRadius: '8px',
      zIndex: 999,
      fontWeight: 'bold'
    }}>
      {message}
    </div>
  );
}

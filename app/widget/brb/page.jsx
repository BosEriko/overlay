'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import Ticker from '../../_components/Ticker';

export default function BrbWidget() {
  const { wsData } = useWebSocket();
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'BRB_COMMAND') {
      setMessage(wsData.message);
      setIsVisible(wsData.isVisible);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return <Ticker message={message} />;
}

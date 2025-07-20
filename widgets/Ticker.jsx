'use client';
import { useEffect, useState } from 'react';
import Ticker from '@components/Ticker';

export default function TickerWidget({ wsData }) {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'TICKER') {
      setMessage(wsData.message);
      setIsVisible(wsData.isVisible);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return <Ticker message={message} />;
}

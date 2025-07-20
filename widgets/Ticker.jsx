'use client';
import { useEffect, useState } from 'react';
import Ticker from '@components/Ticker';
import Screen from '@components/Screen';

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

  return (
    <Screen>
      <Ticker message={message} />
    </Screen>
  );
}

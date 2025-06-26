'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../_hooks/useWebsocket';
import Window from '../_components/Window';
import Marquee from "react-fast-marquee";

export default function Brb() {
  const { wsData } = useWebSocket();
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'BRB_COMMAND') {
      setMessage(wsData.message);
      setIsVisible(wsData.isVisible);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return (
    <Window title="⌚ Be Right Back">
      <Marquee className="bg-green-100">
        <div className="text-4xl h-15 flex items-center uppercase">{message}</div>
      </Marquee>
    </Window>
  );
}

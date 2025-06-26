'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../_hooks/useWebsocket';
import Window from '../_components/Window';

export default function Chat() {
  const { wsData } = useWebSocket();
  const [chat, setChat] = useState([]);

  useEffect(() => {
    if (wsData?.type === 'NEW_CHAT') {
      setChat([...chat, [wsData.username, wsData.message]]);
    }
  }, [wsData]);

  return (
    <Window title="📱 Chat">
      <div className="h-100 relative bg-bottom bg-cover" style={{ backgroundImage: "url('https://imgur.com/ZCEqZad.png')" }}>
        <div className="w-full absolute bottom-0 left-0 flex flex-col gap-1 p-1">
          {chat.map((chat, index) => (
            <div key={index} className="text-2xl">
              <span className="text-orange-700 mr-1">{chat[0]}:</span> {chat[1]}
            </div>
          ))}
        </div>
      </div>
    </Window>
  );
}

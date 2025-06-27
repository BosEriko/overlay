'use client';
import { useWebSocket } from '../../_hooks/useWebsocket';

const WebSocketStatus = () => {
  const { isConnected } = useWebSocket();

  return (
    <div className="h-[1080px] w-[1920px]">
        <div className={`m-5 px-3 py-2 rounded-xl inline-block shadow-lg text-white font-semibold ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
        {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
    </div>
  );
};

export default WebSocketStatus;

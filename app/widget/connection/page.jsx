'use client';
import { useWebSocket } from '../../_hooks/useWebsocket';

const WebSocketStatus = () => {
  const { isConnected } = useWebSocket();

  if (isConnected) return null;

  return (
    <div className="h-[1080px] w-[1920px]">
      <div className="m-5 px-3 py-2 rounded-xl inline-block shadow-lg text-white font-semibold bg-red-600">
        ❌ Disconnected
      </div>
    </div>
  );
};

export default WebSocketStatus;

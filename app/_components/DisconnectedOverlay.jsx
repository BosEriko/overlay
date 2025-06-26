'use client';

import { useWebSocket } from '../_hooks/useWebsocket';

export default function DisconnectedOverlay() {
  const { connected } = useWebSocket();

  if (connected) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center pointer-events-none">
      <div className="text-white text-2xl font-bold">
        BotEriko is Disconnected.
      </div>
    </div>
  );
}

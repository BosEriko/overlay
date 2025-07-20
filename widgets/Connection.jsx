'use client';
import Screen from '@components/Screen';

export default function ConnectionWidget({ useWebSocket }) {
  const { isConnected } = useWebSocket();

  if (isConnected) return null;

  return (
    <Screen>
      <div className="m-5 px-3 py-2 rounded-xl inline-block shadow-lg text-white font-semibold bg-red-600">
        ❌ Disconnected
      </div>
    </Screen>
  );
};

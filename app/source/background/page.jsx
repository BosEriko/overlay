'use client';
import FeedWidget from "@widgets/Feed";
import CensorWidget from "@widgets/Censor";
import { useWebSocket } from '@hooks/useWebsocket';

export default function BackgroundSource() {
  const { wsData } = useWebSocket();

  return (
    <div>
      <CensorWidget wsData={wsData} />
      <FeedWidget wsData={wsData} />
    </div>
  );
}

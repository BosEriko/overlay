'use client';
import CensorWidget from "@widgets/Censor";
import FeedWidget from "@widgets/Feed";
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

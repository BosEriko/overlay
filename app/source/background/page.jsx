'use client';
import FeedWidget from "@widgets/feed";
import CensorWidget from "@widgets/censor";
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

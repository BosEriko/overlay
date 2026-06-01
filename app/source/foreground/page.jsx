'use client';
import SoundWidget from "@widgets/Sound";
import DesktopWidget from "@widgets/Desktop";
import DetailWidget from "@widgets/Detail";
import WinnerWidget from "@widgets/Winner";
import ProgressWidget from "@widgets/Progress";
import ProductivityWidget from "@widgets/Productivity";
import ConnectionWidget from "@widgets/Connection";
import TypingWidget from "@widgets/Typing";
import ScreensaverWidget from "@widgets/Screensaver";
import GettingStartedWidget from "@widgets/GettingStarted";
import { useWebSocket } from '@hooks/useWebsocket';

export default function ForegroundSource() {
  const { wsData } = useWebSocket();

  return (
    <div>
      <SoundWidget wsData={wsData} />
      <DesktopWidget />
      <DetailWidget wsData={wsData} />
      <WinnerWidget wsData={wsData} />
      <ProgressWidget wsData={wsData} />
      <ProductivityWidget wsData={wsData} />
      <ConnectionWidget useWebSocket={useWebSocket} />
      <TypingWidget wsData={wsData} />
      <ScreensaverWidget wsData={wsData} />
      <GettingStartedWidget wsData={wsData} />
    </div>
  );
}

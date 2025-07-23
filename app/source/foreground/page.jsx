'use client';
import SoundWidget from "@widgets/Sound";
import DesktopWidget from "@widgets/Desktop";
import CountdownWidget from "@widgets/Countdown";
import DetailWidget from "@widgets/Detail";
import WinnerWidget from "@widgets/Winner";
import TaskManagerWidget from "@widgets/TaskManager";
import ConnectionWidget from "@widgets/Connection";
import TypingWidget from "@widgets/Typing";
import TickerWidget from "@widgets/Ticker";
import GettingStartedWidget from "@widgets/GettingStarted";
import { useWebSocket } from '@hooks/useWebsocket';

export default function ForegroundSource() {
  const { wsData } = useWebSocket();

  return (
    <div>
      <SoundWidget wsData={wsData} />
      <DesktopWidget />
      <CountdownWidget />
      <DetailWidget wsData={wsData} />
      <WinnerWidget wsData={wsData} />
      <TaskManagerWidget wsData={wsData} />
      <ConnectionWidget useWebSocket={useWebSocket} />
      <TypingWidget wsData={wsData} />
      <TickerWidget wsData={wsData} />
      <GettingStartedWidget wsData={wsData} />
    </div>
  );
}

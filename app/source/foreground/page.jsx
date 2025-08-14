'use client';
import MusicWidget from "@widgets/Music";
import SoundWidget from "@widgets/Sound";
import DesktopWidget from "@widgets/Desktop";
import CountdownWidget from "@widgets/Countdown";
import PlayerWidget from "@widgets/Player";
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
      <MusicWidget wsData={wsData} />
      <SoundWidget wsData={wsData} />
      <DesktopWidget />
      <CountdownWidget />
      <PlayerWidget wsData={wsData} />
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

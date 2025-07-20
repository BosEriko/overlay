
'use client';
import { useWebSocket } from '@hooks/useWebsocket';

export default function ForegroundSource() {
  const { wsData } = useWebSocket();

  return (
    <div>
      {/* <SoundWidget wsData={wsData} /> */}
      {/* <DesktopWidget wsData={wsData} /> */}
      {/* <CountdownWidget wsData={wsData} /> */}
      {/* <DetailWidget wsData={wsData} /> */}
      {/* <WinnerWidget wsData={wsData} /> */}
      {/* <TaskManagerWidget wsData={wsData} /> */}
      {/* <ConnectionWidget wsData={wsData} /> */}
      {/* <TypingWidget wsData={wsData} /> */}
      {/* <TickerWidget wsData={wsData} /> */}
      {/* <GettingStartedWidget wsData={wsData} /> */}
    </div>
  );
}

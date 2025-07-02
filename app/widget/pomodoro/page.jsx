'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons'; 
import Window from '../../_components/Window';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function PomodoroWidget() {
  const { wsData } = useWebSocket();
  const [timerState, setTimerState] = useState({
    time: 0,
    isPomodoroActive: false,
    isBreakTime: false,
    isPaused: false,
    isVisible: false
  });

  useEffect(() => {
    if (!wsData) return;

    if (wsData.type === 'TIMER_STATE') {
      setTimerState({
        time: wsData.time,
        isPomodoroActive: wsData.isPomodoroActive,
        isBreakTime: wsData.isBreakTime,
        isPaused: wsData.isPaused,
        isVisible: wsData.isVisible
      });
    }
  }, [wsData]);

  if (!timerState.isPomodoroActive) return null;

  let bgColor = 'tomato';
  let message = 'Focusing';

  if (timerState.isPaused) {
    bgColor = 'dodgerblue';
    message = 'Paused';
  } else if (timerState.isBreakTime) {
    bgColor = 'lightgreen';
    message = 'Break';
  }

  if (!timerState.isVisible) return null;

  const Icon = () => (
    <FontAwesomeIcon
      icon={faClock}
      className="text-yellow-700 text-3xl drop-shadow-[1px_1px_2px_white]"
    />
  );

  return (
    <div className="h-[1080px] w-[1920px] relative">
      <div className="absolute right-[17px] top-[69px]">
        <Window title={message} icon={Icon}>
            <div
            style={{ backgroundColor: bgColor }}
            className="text-[100px] text-white text-center w-full h-full flex items-center justify-center"
            >
            <div>{formatTime(timerState.time)}</div>
            </div>
        </Window>
      </div>
    </div>
  );
}

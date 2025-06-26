'use client';
import { useWebSocket } from '../_hooks/useWebsocket';
import { useState, useEffect } from 'react';
import Window from '../_components/Window';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function Pomodoro() {
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
  let message = '🍅 Focusing';

  if (timerState.isPaused) {
    bgColor = 'dodgerblue';
    message = '⏸️ Paused';
  } else if (timerState.isBreakTime) {
    bgColor = 'lightgreen';
    message = '☕ Break';
  }

  if (!timerState.isVisible) return null;

  return (
    <Window title={message}>
      <div style={{ backgroundColor: bgColor }} className="p-4 text-[100px] text-white text-center">
        <div>{formatTime(timerState.time)}</div>
      </div>
    </Window>
  );
}

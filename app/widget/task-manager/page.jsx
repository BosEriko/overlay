'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons'; 
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import Window from '../../_components/Window';

const PomodoroIcon = () => (
  <FontAwesomeIcon
    icon={faClock}
    className="text-yellow-700 text-3xl drop-shadow-[1px_1px_2px_white]"
  />
);

const TodoIcon = () => (
  <FontAwesomeIcon
    icon={faListCheck}
    className="text-yellow-700 text-3xl drop-shadow-[1px_1px_2px_white]"
  />
);

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export default function TaskManagerWidget() {
  const { wsData } = useWebSocket();
  const [timerState, setTimerState] = useState({
    time: 0,
    isPomodoroActive: false,
    isBreakTime: false,
    isPaused: false,
    isVisible: false
  });
  const [todoState, setTodoState] = useState({
    todos: [],
    isVisible: false,
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

    if (wsData.type === 'TODO') {
      setTodoState({
        todos: wsData.todos || [],
        isVisible: wsData.isVisible,
      });
    }
  }, [wsData]);

  const isPomodoroVisible = timerState.isVisible && timerState.isPomodoroActive;
  const isTodoVisible = todoState.isVisible && todoState.todos.length > 0;

  if (!isPomodoroVisible && !isTodoVisible) return null;

  let bgColor = 'tomato';
  let message = 'Focusing';

  if (timerState.isPaused) {
    bgColor = 'dodgerblue';
    message = 'Paused';
  } else if (timerState.isBreakTime) {
    bgColor = 'lightgreen';
    message = 'Break';
  }

  const displayedTodos = todoState.todos.slice(0, 5);
  const hasMore = todoState.todos.length > 5;

  return (
    <div className="h-[1080px] w-[1920px] relative">
      <div className="absolute right-[17px] top-[66px] flex flex-col gap-[10px]">
        { isPomodoroVisible && <Window title={message} icon={PomodoroIcon} width="400px" height="auto">
            <div
              style={{ backgroundColor: bgColor }}
              className="text-[100px] text-white text-center w-full h-full flex items-center justify-center"
            >
              <div>{formatTime(timerState.time)}</div>
            </div>
        </Window> }
        { isTodoVisible && <Window title="Todo" icon={TodoIcon} width="400px" height="auto">
          <div className="bg-yellow-500 text-yellow-700 text-xl p-4 w-full h-full [text-shadow:_1px_1px_2px_white]">
            <ul className="space-y-2">
              {displayedTodos.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start"
                >
                  <span className="mr-2">{index + 1}.</span>
                  <span className={`overflow-hidden whitespace-nowrap text-ellipsis ${item.done ? 'line-through' : ''}`}>{item.todo}</span>
                </li>
              ))}
              {hasMore && (
                <li className="text-sm italic text-yellow-700">
                  ...and more
                </li>
              )}
            </ul>
          </div>
        </Window> }
      </div>
    </div>
  );
}

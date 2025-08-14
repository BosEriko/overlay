'use client';
import { useEffect, useState, useRef } from 'react';
import { Pixelify_Sans } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons'; 
import { faListCheck, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import Window from '@components/Window';
import Screen from '@components/Screen';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700'],
});

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

export default function TaskManagerWidget({ wsData }) {
  const [musicDetail, setMusicDetail] = useState(null);
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

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!wsData) return;

    if (wsData?.type === 'MUSIC_DETAIL') {
      setMusicDetail(wsData.musicDetails);
    }

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

  useEffect(() => {
    if (!musicDetail) return;

    clearInterval(intervalRef.current);

    if (musicDetail.isPlaying) {
      intervalRef.current = setInterval(() => {
        setMusicDetail(prev => {
          if (!prev) return prev;

          const [cm, cs] = prev.currentTime.split(':').map(Number);
          const [lm, ls] = prev.length.split(':').map(Number);

          const currentSec = cm * 60 + cs + 1;
          const lengthSec = lm * 60 + ls;

          if (currentSec >= lengthSec) {
            return { ...prev, currentTime: prev.length, progress: 100 };
          }

          const mm = Math.floor(currentSec / 60);
          const ss = String(currentSec % 60).padStart(2, '0');

          return {
            ...prev,
            currentTime: `${mm}:${ss}`,
            progress: (currentSec / lengthSec) * 100,
          };
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [musicDetail?.isPlaying]);

  const isMusicPlayerVisible = musicDetail;
  const isPomodoroVisible = timerState.isVisible && timerState.isPomodoroActive;
  const isTodoVisible = todoState.isVisible && todoState.todos.length > 0;

  if (!isMusicPlayerVisible && !isPomodoroVisible && !isTodoVisible) return null;

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
    <Screen>
      <div className="absolute right-[17px] top-[66px] flex flex-col gap-[10px] items-end">
        { isMusicPlayerVisible && <div className="flex items-center gap-4 p-1 bg-yellow-300 rounded-[10px] shadow-xl mx-auto border-[5px] border-yellow-500">
          <img
            src={musicDetail.albumCoverUrl}
            alt={musicDetail.title}
            className="w-20 h-20 rounded-[5px] object-cover shadow-md"
          />
          <div className="flex flex-col flex-1">
            <h2 className={`${pixelify.className} text-2xl font-bold text-yellow-800 truncate w-[225px]`}>
              {musicDetail.title}
            </h2>
            <p className="text-sm text-yellow-700 font-bold truncate w-[225px]">
              {musicDetail.singer}
            </p>

            <div className="w-full h-2 bg-yellow-400 rounded-full mt-2 overflow-hidden">
              <div
                className="h-2 bg-yellow-800 transition-all duration-500 ease-linear"
                style={{ width: `${musicDetail.progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-yellow-700 font-bold mt-1">
              <span>{musicDetail.currentTime}</span>
              <span>{musicDetail.length}</span>
            </div>
          </div>

          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-800 transition mr-1">
            <FontAwesomeIcon
              icon={musicDetail.isPlaying ? faPause : faPlay}
              className="text-yellow-300 w-5 h-5"
            />
          </button>
        </div> }
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
                  <span className="overflow-hidden whitespace-nowrap text-ellipsis">{item.content}</span>
                </li>
              ))}
              {hasMore && (
                <li className="text-sm italic text-yellow-700">
                  ...and {todoState.todos.length - 5} more
                </li>
              )}
            </ul>
          </div>
        </Window> }
      </div>
    </Screen>
  );
}

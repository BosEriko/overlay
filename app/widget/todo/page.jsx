'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import Window from '../../_components/Window';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';

export default function TodoWidget() {
  const { wsData } = useWebSocket();
  const [todoState, setTodoState] = useState({
    todos: [],
    isVisible: false,
  });

  useEffect(() => {
    if (!wsData) return;

    if (wsData.type === 'TODO') {
      setTodoState({
        todos: wsData.todos || [],
        isVisible: wsData.isVisible,
      });
    }
  }, [wsData]);

  if (!todoState.isVisible || todoState.todos.length === 0) return null;

  const Icon = () => (
    <FontAwesomeIcon
      icon={faListCheck}
      className="text-yellow-700 text-3xl drop-shadow-[1px_1px_2px_white]"
    />
  );

  const displayedTodos = todoState.todos.slice(0, 5);
  const hasMore = todoState.todos.length > 5;

  return (
    <div className="h-[1080px] w-[1920px] relative">
      <div className="absolute right-[17px] top-[374px]">
        <Window title="Todo" icon={Icon} height="auto">
          <div className="bg-yellow-500 text-yellow-700 text-xl p-4 w-full h-full [text-shadow:_1px_1px_2px_white]">
            <ul className="space-y-2">
              {displayedTodos.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start"
                >
                  <span className="mr-2">{index + 1}.</span>
                  <span className={item.done ? 'line-through' : ''}>{item.todo}</span>
                </li>
              ))}
              {hasMore && (
                <li className="text-sm italic text-yellow-700">
                  ...and more
                </li>
              )}
            </ul>
          </div>
        </Window>
      </div>
    </div>
  );
}

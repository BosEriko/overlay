'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '@hooks/useWebsocket';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

export default function TypingWidget() {
  const { wsData } = useWebSocket();
  const [words, setWords] = useState([]);
  const [idCounter, setIdCounter] = useState(0);

  useEffect(() => {
    if (!wsData) return;

    if (wsData.type === 'NEW_WORD') {
      setWords(prev => [
        ...prev,
        {
          id: idCounter,
          text: wsData.word,
          x: Math.random() * 80 + 10
        }
      ]);
      setIdCounter(prev => prev + 1);
    }

    if (wsData.type === 'CORRECT_GUESS') {
      setWords(prev => prev.filter(word => word.text !== wsData.word));
    }
  }, [wsData]);

  return (
    <div className="h-[1080px] w-[1920px]">
      {words.map(word => (
        <div
          key={word.id}
          className={`bg-yellow-300 ${pixelify.className} border-yellow-500 border-[5px] text-yellow-800 rounded-2xl shadow-xl p-2 text-4xl`}
          style={{
            position: 'absolute',
            left: `${word.x}%`,
            animation: 'fall 20s cubic-bezier(0.25, 1, 0.5, 1) forwards'
          }}
        >
          {word.text}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { top: -60px; opacity: 1; transform: scale(1); }
          100% { top: calc(100vh + 60px); opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
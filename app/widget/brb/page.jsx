'use client';
import { useEffect, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';
import Marquee from 'react-fast-marquee';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const profileImage = (
  <img src="/images/profile.png" alt="Profile" className="w-30 h-30" />
);

function generateSequence(message, repeat = 7) {
  const items = [];
  for (let i = 0; i < repeat; i++) {
    items.push(
      <div key={`img-${i}`}>{profileImage}</div>,
      <div key={`msg-${i}`}>{message}</div>
    );
  }
  return items;
}

function MarqueeRow({ message, direction }) {
  return (
    <Marquee direction={direction}>
      <div className="text-[100px] h-[150px] flex gap-[20px] items-center uppercase mr-[20px]">
        {generateSequence(message)}
      </div>
    </Marquee>
  );
}

export default function BrbWidget() {
  const { wsData } = useWebSocket();
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (wsData?.type === 'BRB_COMMAND') {
      setMessage(wsData.message);
      setIsVisible(wsData.isVisible);
    }
  }, [wsData]);

  if (!isVisible) return null;

  return (
    <div className={`${pixelify.className} h-[1080px] w-[1920px] overflow-hidden text-yellow-700 bg-yellow-300`}>
      {[...Array(50)].map((_, i) => (
        <MarqueeRow
          key={i}
          message={message}
          direction={i % 2 === 0 ? 'left' : 'right'}
        />
      ))}
    </div>
  );
}

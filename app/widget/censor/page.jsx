'use client';
import { useEffect, useRef, useState } from 'react';
import { useWebSocket } from '../../_hooks/useWebsocket';

export default function BrbWidget() {
  const { wsData } = useWebSocket();
  const [isVisible, setIsVisible] = useState(false);
  const boxRef = useRef(null);
  const containerRef = useRef(null);

  const boxWidth = 300;
  const boxHeight = 300;

  useEffect(() => {
    if (wsData?.type === 'CENSOR') {
      setIsVisible((prev) => !prev);
    }
  }, [wsData]);

  useEffect(() => {
    if (!isVisible) return;

    const box = boxRef.current;
    const container = containerRef.current;
    if (!box || !container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    let x = Math.random() * (containerWidth - boxWidth);
    let y = Math.random() * (containerHeight - boxHeight);
    let dx = 2;
    let dy = 2;

    const move = () => {
      x += dx;
      y += dy;

      if (x + boxWidth >= containerWidth || x <= 0) dx *= -1;
      if (y + boxHeight >= containerHeight || y <= 0) dy *= -1;

      box.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(move);
    };

    requestAnimationFrame(move);
  }, [isVisible, boxWidth, boxHeight]);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} className="w-[1920px] h-[1080px] bg-yellow-500 overflow-hidden relative">
      <div ref={boxRef} style={{ width: `${boxWidth}px`, height: `${boxHeight}px` }} className="absolute top-0 left-0">
        <img src="/images/profile.png" alt="Profile" className="w-full h-full" />
      </div>
    </div>
  );
}

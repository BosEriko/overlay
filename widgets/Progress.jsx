'use client';
import { useEffect, useState } from 'react';
import { Pixelify_Sans } from 'next/font/google';
import Screen from '@components/Screen';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const Container = ({ children }) => (
  <div className="ml-[17px] mt-[66px]">{children}</div>
);

const Progress = ({ percent }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={`${pixelify.className} relative w-[100px] h-[100px] bg-yellow-300 shadow-xl rounded-full flex items-center justify-center`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg]"
      >
        <circle
          stroke="#facc15"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="opacity-30"
        />

        <circle
          stroke="#ca8a04"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{
            strokeDashoffset,
            transition: 'stroke-dashoffset 0.5s ease'
          }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl text-yellow-700">{percent}%</div>
      </div>
    </div>
  );
};

export default function ProgressWidget({ wsData }) {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    if (wsData?.type === 'STREAM_DETAIL') {
      setProgress(wsData.steam.gamePercent);
    }
  }, [wsData]);

  if (!progress) return null;

  return (
    <Screen>
      <Container>
        <Progress percent={progress} />
      </Container>
    </Screen>
  );
}

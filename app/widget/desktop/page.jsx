'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { faWifi, faVolumeUp, faBatteryFull, faUser } from '@fortawesome/free-solid-svg-icons';

export default function DesktopWidget() {
  const [time, setTime] = useState(new Date());
  const [showColon, setShowColon] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
      setShowColon(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  return (
    <div className="h-[1080px] w-[1920px] text-white font-sans">
      <div className="flex bg-[#191a25] m-5 rounded-lg p-2 items-center text-sm glassmorphism">
        <div className="flex-1 flex items-center gap-2 pl-3">
          <FontAwesomeIcon icon={faTwitch} className="text-purple-400 text-lg" />
          <span className="font-semibold">BosEriko</span>
        </div>

        <div className="text-center text-base font-medium tabular-nums">
          <span>{hours}</span>
          <span className={`${showColon ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>:</span>
          <span>{minutes}</span>
        </div>

        <div className="flex-1 flex justify-end gap-4 pr-3">
          <FontAwesomeIcon icon={faWifi} />
          <FontAwesomeIcon icon={faVolumeUp} />
          <FontAwesomeIcon icon={faBatteryFull} />
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    </div>
  );
}

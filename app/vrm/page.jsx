'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const VRMViewer = dynamic(() => import('./VRMViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-screen h-screen bg-[#00ff00]">
      <p className="text-white text-xl">Loading VRM...</p>
    </div>
  ),
});

export default function VRMPage() {
  const [isSafari, setIsSafari] = useState(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsSafari(/^((?!chrome|android|crios|fxios|edg|opera|brave).)*safari/i.test(ua));
  }, []);

  if (isSafari === null) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-[#00ff00]">
        <p className="text-white text-xl">Checking browser...</p>
      </div>
    );
  }

  if (!isSafari) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-[#00ff00]">
        <p className="text-white text-xl">This page only works in Safari.</p>
      </div>
    );
  }

  return <VRMViewer />;
}

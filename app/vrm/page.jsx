'use client';

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
  return <VRMViewer />;
}

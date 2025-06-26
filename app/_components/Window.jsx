'use client';
import { Pixelify_Sans } from 'next/font/google';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

export default function Window({ children, title = "Window", width = 500, height = "auto"}) {
  const buttonClass=`${pixelify.className} text-xl border-3 border-red-500 bg-red-300 text-center w-8 h-8 flex items-center justify-center text-white rounded-md`;

  return (
    <div className="bg-yellow-300 border-[10px] border-yellow-300 rounded-2xl overflow-hidden shadow-xl" style={{ width: width, height: height}}>
      <div className="flex items-center justify-between">
        <div className={`${pixelify.className} text-4xl p-2 text-yellow-800`}>{title}</div>
        <div className="flex gap-3 items-center">
          <div className={buttonClass}>_</div>
          <div className={buttonClass}>X</div>
        </div>
      </div>
      <div className={`overflow-hidden border-yellow-500 border-[5px] shadow-sm ${pixelify.className}`}>{children}</div>
    </div>
  );
}

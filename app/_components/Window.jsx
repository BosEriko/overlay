'use client';
import { Pixelify_Sans } from 'next/font/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['700']
});

const DefaultIcon = () => {
    return (
        <FontAwesomeIcon
            icon={faTwitch}
            className="text-yellow-700 text-3xl drop-shadow-[1px_1px_2px_white]"
        />
    );
};

export default function Window({ children, title = "Window", icon: Icon = DefaultIcon, width = 500, height = 300}) {
  return (
    <div className={`${pixelify.className} text-white flex flex-col overflow-hidden`} style={{ width: `${width}px`, height: `${height}px`, borderRadius: '25px' }}>
      <div className="flex items-center z-20 px-3 pt-3">
        <div className="flex-1">
            <Icon />
        </div>
        <div className="flex items-center gap-2 text-yellow-700 font-bold text-3xl [text-shadow:_1px_1px_2px_white]">
          <span>{title}</span>
        </div>
        <div className="flex-1 flex justify-end items-center gap-3">
          <div className="border border-white w-5 h-5 rounded-full bg-red-500"></div>
          <div className="border border-white w-5 h-5 rounded-full bg-yellow-400"></div>
          <div className="border border-white w-5 h-5 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="border-10 border-yellow-300 flex-1 w-full flex items-center justify-center w-full h-full border-main z-10">
        <div style={{ borderRadius: '15px' }} className="overflow-hidden w-full h-full">{children}</div>
      </div>
    </div>
  );
}
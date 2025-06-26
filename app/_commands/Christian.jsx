'use client';
import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { useWebSocket } from '../_hooks/useWebsocket';

const IMAGE_URL = 'https://cdn.wallpapersafari.com/93/84/S1vhtc.jpg';
const AUDIO_URL = 'https://sounds.pond5.com/bell-church-sound-effect-008716194_nw_prev.m4a';

export default function Christian() {
  const { wsData } = useWebSocket();
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);
  const timeoutIdRef = useRef(null);

  useEffect(() => {
    if (wsData?.type === 'CHRISTIAN_EFFECT') {
      console.log('called');
      setIsVisible(true);

      if (audioRef.current) {
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } catch (err) {
          console.error('Failed to play audio:', err);
        }
      }

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        setIsVisible(false);
        timeoutIdRef.current = null;
      }, 2000);
    }
  }, [wsData]);

  return (
    <>
      <Head>
        <link rel="preload" as="image" href={IMAGE_URL} />
        <link rel="preload" as="audio" href={AUDIO_URL} />
      </Head>

      <audio ref={audioRef} src={AUDIO_URL} preload="auto" />

      {isVisible && (
        <div
          className="w-[1920px] h-[1080px] bg-cover bg-center"
          style={{ backgroundImage: `url(${IMAGE_URL})` }}
        />
      )}
    </>
  );
}

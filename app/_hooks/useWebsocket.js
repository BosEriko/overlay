"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import env from "../_utilities/env";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [wsData, setWsData] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(env.websocket);

    setSocket(ws);

    ws.onopen = () => {
      console.log('✅ Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 Received from bot:', data);
      setWsData(data);
    };

    ws.onclose = () => {
      console.log('❌ WebSocket connection closed');
    };

    return () => ws.close();
  }, []);

  return (
    <WebSocketContext.Provider value={{ wsData, socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

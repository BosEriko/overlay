"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import env from "../_utilities/env";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [wsData, setWsData] = useState(null);
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    let ws;

    const connect = () => {
      ws = new WebSocket(env.websocket);
      setSocket(ws);

      ws.onopen = () => {
        console.log('✅ Connected to WebSocket server');
        setConnected(true);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('📨 Received from bot:', data);
        setWsData(data);
      };

      ws.onclose = () => {
        console.log('❌ WebSocket connection closed');
        setConnected(false);
        setTimeout(connect, 3000);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ wsData, socket, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);

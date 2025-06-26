import { WebSocketProvider } from './_hooks/useWebsocket';
import DisconnectedOverlay from './_components/DisconnectedOverlay';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebSocketProvider>
          <div className="relative">
            {children}
            <DisconnectedOverlay />
          </div>
        </WebSocketProvider>
      </body>
    </html>
  );
}

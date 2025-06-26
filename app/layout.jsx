import { WebSocketProvider } from './_hooks/useWebsocket';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebSocketProvider>
          <div className="relative">
            {children}
          </div>
        </WebSocketProvider>
      </body>
    </html>
  );
}

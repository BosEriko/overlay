import { WebSocketProvider } from './_hooks/useWebsocket';
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <WebSocketProvider>
          <div>{children}</div>
        </WebSocketProvider>
      </body>
    </html>
  );
}

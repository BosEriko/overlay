import { Geist, Geist_Mono } from "next/font/google";
import { WebSocketProvider } from './_hooks/useWebsocket';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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

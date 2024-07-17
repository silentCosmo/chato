import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chato - Connect with New People | Text Chat and Video Calls",
  description: "Chato is a fun and engaging platform for meeting new people through text chats and upcoming video calls. Start your conversation now and connect with strangers around the world.",
  keywords: "Chato, chat app, text messaging, video calls, meet new people, online chat, social app, connect with strangers",
  author: "Chato Team",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  language: "en-US",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <GoogleAnalytics gaId="G-E2BWEYV9P3" />
    </html>
  );
}

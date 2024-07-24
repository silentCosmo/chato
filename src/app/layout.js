import { GoogleAnalytics } from '@next/third-parties/google'
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Helbeku - Connect with New People | Free Text Chat and Video Calls",
  description: "Helbeku is a free and engaging platform for meeting new people through text chats and upcoming video calls. Discover a fun way to connect with strangers around the world without the need for sign-up.",
  keywords: "Helbeku, chat app, free text messaging, video calls, meet new people, online chat, social app, connect with strangers, Omegle alternative, chat platform",
  author: "Helbeku Team",
  robots: "index, follow",
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

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://drawboardx.vercel.app"),

  title: "DrawBoard - Real-Time Collaborative Whiteboard",
  description:
    "DrawBoard is a fast, real-time collaborative whiteboard for sketching, brainstorming, planning, and idea sharing — right from your browser.",

  keywords: [
    "real-time drawing",
    "collaborative whiteboard",
    "online whiteboard",
    "real-time brainstorming",
    "digital whiteboard",
    "team collaboration",
    "sketch online",
    "draw online",
    "canvas whiteboard",
    "Figma whiteboard alternative",
    "group drawing",
    "real-time sketching app",
    "whiteboard for teams",
  ],

  authors: [{ name: "sanjitxdutta" }],

  icons: {
    icon: "/favicon.png",
  },

  openGraph: {
    title: "DrawBoard - Real-Time Collaborative Whiteboard",
    description:
      "Sketch, brainstorm, and collaborate with your team in real-time using DrawBoard — a minimal, fast browser-based whiteboard.",
    url: "https://drawboardx.vercel.app",
    siteName: "DrawBoard",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "DrawBoard - Real-Time Collaborative Whiteboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "DrawBoard - Real-Time Collaborative Whiteboard",
    description:
      "Real-time drawing and collaboration right from your browser. No installs. No lag.",
    images: ["/og.png"],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

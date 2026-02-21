import type { Metadata, Viewport } from "next";
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
  title: "VibeText — Share text with a code",
  description:
    "Paste text, get a short code. Open that code on any device to see your text. No sign-up, no email — just a code. Built with Next.js, Tailwind CSS, and PostgreSQL.",
  keywords: ["share text", "paste", "code", "cross-device", "next.js"],
  authors: [{ name: "VibeText" }],
  openGraph: {
    title: "VibeText — Share text with a code",
    description:
      "Paste text, get a code. Open it on any device. No sign-up — just a code.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

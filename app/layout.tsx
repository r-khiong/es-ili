import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Noto_Sans_TC } from "next/font/google";
import "./globals.css";

// EN skeleton. Landing-page-specific per the RSVP-9 redesign spec — this
// deviates from the CLAUDE.md §8.6 Geist lock, which governs the product UI.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// CJK fallback. DM Sans has no CJK glyphs, so Chinese body copy must reach
// Noto Sans TC via the font stack (see globals.css --font-sans).
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RSVP",
  description: "Event RSVP & check-in system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${notoSansTC.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

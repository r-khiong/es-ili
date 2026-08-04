import type { Metadata } from "next";
import { Archivo, Geist_Mono, Inter, Noto_Sans_TC } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Single source for every font in the project (RSVP-9). Pages must not call
// next/font themselves — a per-page load ships a second copy of the same family
// and splits the CSS-variable namespace, which is how this repo ended up with
// seven webfonts across three files.

// Display face: hero, section headings, wordmark caption.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

// Body face, and the value behind --font-sans (see globals.css).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Eyebrows, labels, timestamps, table headers.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// CJK fallback. Archivo and Inter carry no CJK glyphs, so Chinese copy reaches
// Noto Sans TC through the font stack. preload is off on purpose: the subsets
// option cannot describe a CJK character set, so Next would preload the full
// Latin slice of three weights for text that is never above the fold.
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  preload: false,
});

export const metadata: Metadata = {
  // Without metadataBase, Next resolves app/opengraph-image.png against
  // http://localhost:3000 and every shared link ships a dead preview image.
  metadataBase: new URL(SITE_URL),
  title: "RSVP",
  description: "Event RSVP & check-in system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // data-scroll-behavior opts into the smooth scrolling globals.css declares.
  // Without it Next forces instant scroll on route transitions and warns; the
  // landing's About link is an in-page anchor that wants the smooth jump.
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${inter.variable} ${geistMono.variable} ${notoSansTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

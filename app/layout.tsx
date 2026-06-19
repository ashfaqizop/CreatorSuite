import type { Metadata } from "next";
import { Silkscreen, Share_Tech_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { AdSlot } from "@/components/AdSlot";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const silkscreen = Silkscreen({
  variable: "--font-silkscreen",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CreatorSuite — Creator Monetization Tools",
  description:
    "21 specialized micro-tools for calculating, predicting, and optimizing creator business income. Dot Matrix design.",
  // Google Search Console (URL-prefix) HTML-tag verification, set via env.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${silkscreen.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* AdSense script loaded globally — manual units only, no auto-ads (§2.7) */}
        {ADSENSE_CLIENT ? (
          <Script
            id="adsense-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        ) : null}

        <SessionProvider>
          <Nav />

          {/* Main + desktop ad sidebar (§6.1) */}
          <div className="flex-1 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 px-4 py-8">
            <main className="flex-1 min-w-0">{children}</main>
            <aside className="hidden lg:block w-[300px] shrink-0">
              <AdSlot placement="sidebar" />
            </aside>
          </div>

          <Footer />
        </SessionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

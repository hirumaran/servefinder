import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Providers } from "@/components/Providers";

import "./globals.css";

// Friendly-but-not-childish pairing: Nunito for display, DM Sans for body.
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

export const metadata: Metadata = {
  title: {
    default: "Servd — Find volunteer opportunities near you",
    template: "%s · Servd",
  },
  description:
    "A free directory that helps high school students find local volunteer opportunities and earn their 40 required community-service hours. No accounts, no tracking.",
};

/**
 * First-visit boot: runs synchronously before first paint (per the
 * preventing-flash-before-hydration guide). If this browser hasn't seen the
 * intro, flag <html> so CSS shows the onboarding overlay from the very first
 * frame — and preload the painting it's about to dither. Home page only;
 * deep links go straight to their content. Blocked storage counts as "seen"
 * so the intro can never trap anyone.
 */
const INTRO_BOOT_SCRIPT = `try{if(location.pathname==="/"&&!localStorage.getItem("servd:onboarded:v1")){document.documentElement.setAttribute("data-servd-intro","");var l=document.createElement("link");l.rel="preload";l.as="image";l.href="/intro/monet-water-lilies.jpg";document.head.appendChild(l)}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the boot script below stamps data-servd-intro
    // on <html> before React hydrates (per the flash-prevention guide).
    <html
      lang="en"
      className={`${nunito.variable} ${dmSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col font-sans">
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT_SCRIPT }} />
        {/* Lets keyboard users jump past the nav on every page. */}
        <a
          href="#main"
          className="print-hide sr-only z-50 rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
        >
          Skip to main content
        </a>
        <Providers>
          <Header />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

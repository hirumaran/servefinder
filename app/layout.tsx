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
    default: "ServeFinder — Find volunteer opportunities near you",
    template: "%s · ServeFinder",
  },
  description:
    "A free directory that helps high school students find local volunteer opportunities and earn their 40 required community-service hours. No accounts, no tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${nunito.variable} ${dmSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">
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

import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { Navbar } from "@/components/navbar";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Notes App",
  description: "A simple notes app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <html suppressHydrationWarning lang="en" className={`${GeistSans.variable}`}>
        <head>
          <script
            crossOrigin="anonymous"
            src="//unpkg.com/react-scan/dist/auto.global.js"
          />
          {/* rest of your scripts go under */}
        </head>
        <body
          suppressHydrationWarning
        >
          <Navbar />
          {children}
        </body>
      </html>
    </Providers>
  );
}

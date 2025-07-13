import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Calico",
  description: "AI-powered financial app",
};
import Head from "next/head";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          id="fouc-fix"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const root = document.documentElement;
                  const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                  if (theme === 'dark' || (theme === null && isSystemDark)) {
                    root.classList.add('dark');
                    root.style.setProperty('color-scheme', 'dark');
                  } else {
                    root.classList.remove('dark');
                    root.style.setProperty('color-scheme', 'light');
                  }
                } catch (e) {
                  console.error("Theme script error:", e);
                }
              })();
            `,
          }}
        />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />

      </body>
    </html>
  );
}

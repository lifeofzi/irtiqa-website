import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'IRTIQA — Ali Saffudin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Space+Mono:wght@400;700&family=Amiri:wght@700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

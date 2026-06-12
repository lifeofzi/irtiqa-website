import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ali Saffudin — Kashmiri Singer-Songwriter | Irtiqa',
  description:
    'Ali Saffudin is a singer-songwriter from Srinagar, Kashmir — blending Alternative Rock and Blues with Kashmiri Sufi poetry. Stream Irtiqa and Wolivo on Spotify, Apple Music, and YouTube.',
  keywords: [
    'Ali Saffudin',
    'Kashmiri singer-songwriter',
    'Kashmir music',
    'Irtiqa',
    'Wolivo',
    'Kashmiri Sufi poetry',
    'Alternative Rock',
    'Blues',
    'Azadi Records',
    'Srinagar',
    'Kashmiri music',
  ],
  openGraph: {
    title: 'Ali Saffudin — Kashmiri Singer-Songwriter',
    description:
      'Ali Saffudin is a singer-songwriter from Srinagar, Kashmir — blending Alternative Rock and Blues with Kashmiri Sufi poetry. Stream Irtiqa and Wolivo on Spotify, Apple Music, and YouTube.',
    type: 'profile',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Saffudin — Kashmiri Singer-Songwriter',
    description:
      'Ali Saffudin is a singer-songwriter from Srinagar, Kashmir. Stream Irtiqa and Wolivo on Spotify, Apple Music, and YouTube.',
  },
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

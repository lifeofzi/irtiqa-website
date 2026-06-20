import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://alisaffudin.com'),
  title: {
    default: 'Ali Saffudin — Kashmiri Singer-Songwriter | Irtiqa',
    template: '%s | Ali Saffudin',
  },
  description: 'Ali Saffudin is a singer-songwriter from Srinagar, Kashmir — blending Alternative Rock and Blues with Kashmiri Sufi poetry. Stream Irtiqa and Wolivo on Spotify, Apple Music, and YouTube.',
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: 'https://alisaffudin.com',
    siteName: 'Ali Saffudin',
    title: 'Ali Saffudin — Kashmiri Singer-Songwriter',
    description: 'Ali Saffudin is a singer-songwriter from Srinagar, Kashmir — blending Alternative Rock and Blues with Kashmiri Sufi poetry.',
    images: [{ url: '/cover.jpg', width: 1200, height: 1200, alt: 'IRTIQA — Ali Saffudin' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Saffudin — Kashmiri Singer-Songwriter',
    description: 'Ali Saffudin is a singer-songwriter from Srinagar, Kashmir — blending Alternative Rock and Blues with Kashmiri Sufi poetry.',
    images: ['/cover.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MusicArtist',
  name: 'Ali Saffudin',
  url: 'https://alisaffudin.com',
  image: 'https://alisaffudin.com/ali.jpg',
  description: 'Singer-songwriter from Hassanabad, Downtown Srinagar, Kashmir. Blends Alternative Rock and Blues with Kashmiri Sufi poetry.',
  genre: ['Alternative Rock', 'Blues', 'Kashmiri Folk', 'Sufi'],
  birthPlace: { '@type': 'Place', name: 'Srinagar, Kashmir, India' },
  sameAs: [
    'https://open.spotify.com/artist/0J3PUchbuLhyRD6RxFQrrE',
    'https://music.apple.com/us/artist/ali-saffudin/1456350962',
    'https://www.youtube.com/channel/UC9ezXxVBdZH7uFwE1Ua57rA',
    'https://music.youtube.com/channel/UCpSS-5kQeow4IGs6Z4dq76w',
    'https://instagram.com/alisaffudin',
    'https://www.facebook.com/alisaffu',
  ],
  album: [
    {
      '@type': 'MusicAlbum',
      name: 'IRTIQA',
      url: 'https://alisaffudin.com/?s=irtiqa',
      numTracks: 4,
      datePublished: '2026',
      image: 'https://alisaffudin.com/cover.jpg',
      byArtist: { '@type': 'MusicArtist', name: 'Ali Saffudin' },
      track: [
        { '@type': 'MusicRecording', name: 'Fariyadras', position: 1 },
        { '@type': 'MusicRecording', name: 'Sui Bulbulah Rach', position: 2 },
        { '@type': 'MusicRecording', name: 'Eid Ayi Tai', position: 3 },
        { '@type': 'MusicRecording', name: 'Ya Rab Daptam', position: 4 },
      ],
    },
    {
      '@type': 'MusicAlbum',
      name: 'Wolivo',
      url: 'https://alisaffudin.com/?s=wolivo',
      numTracks: 10,
      datePublished: '2022',
      image: 'https://alisaffudin.com/wolivo.webp',
      byArtist: { '@type': 'MusicArtist', name: 'Ali Saffudin' },
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

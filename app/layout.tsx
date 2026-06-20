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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://alisaffudin.com/#website',
    name: 'Ali Saffudin',
    url: 'https://alisaffudin.com',
    description: 'Official website of Ali Saffudin — Kashmiri Singer-Songwriter',
    author: { '@type': 'MusicArtist', '@id': 'https://alisaffudin.com/#artist' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MusicArtist',
    '@id': 'https://alisaffudin.com/#artist',
    name: 'Ali Saffudin',
    url: 'https://alisaffudin.com',
    image: 'https://alisaffudin.com/ali.jpg',
    description: 'Singer-songwriter from Hassanabad, Downtown Srinagar, Kashmir. Blends Alternative Rock and Blues with Kashmiri Sufi poetry.',
    genre: ['Alternative Rock', 'Blues', 'Kashmiri Folk', 'Sufi'],
    birthPlace: { '@type': 'Place', name: 'Srinagar, Kashmir, India' },
    recordLabel: { '@type': 'Organization', name: 'Azadi Records' },
    sameAs: [
      'https://open.spotify.com/artist/0J3PUchbuLhyRD6RxFQrrE',
      'https://music.apple.com/us/artist/ali-saffudin/1456350962',
      'https://www.youtube.com/channel/UC9ezXxVBdZH7uFwE1Ua57rA',
      'https://music.youtube.com/channel/UCpSS-5kQeow4IGs6Z4dq76w',
      'https://www.instagram.com/alisaffudin',
      'https://www.facebook.com/alisaffu/',
    ],
    album: [
      { '@type': 'MusicAlbum', '@id': 'https://alisaffudin.com/#album-irtiqa' },
      { '@type': 'MusicAlbum', '@id': 'https://alisaffudin.com/#album-wolivo' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': 'https://alisaffudin.com/#album-irtiqa',
    name: 'IRTIQA',
    url: 'https://alisaffudin.com/?s=irtiqa',
    numTracks: 4,
    datePublished: '2026',
    image: 'https://alisaffudin.com/cover.jpg',
    albumReleaseType: 'https://schema.org/EPRelease',
    byArtist: { '@type': 'MusicArtist', '@id': 'https://alisaffudin.com/#artist' },
    sameAs: [
      'https://open.spotify.com/album/7ywkGokC4VJcQwqSM4CXuN',
      'https://music.apple.com/us/album/irtiqa-ep/6773801507',
      'https://www.youtube.com/playlist?list=OLAK5uy_mGlIUjQvewEWnAZFDXhViSu3fB0VVoGRE',
    ],
    track: [
      { '@type': 'MusicRecording', name: 'Fariyadras', position: 1, inAlbum: { '@id': 'https://alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=brnIKzYLdp4' },
      { '@type': 'MusicRecording', name: 'Sui Bulbulah Rach', position: 2, inAlbum: { '@id': 'https://alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=IN-s9IAHV7Q' },
      { '@type': 'MusicRecording', name: 'Eid Ayi Tai', position: 3, inAlbum: { '@id': 'https://alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=3d5BAnarNMc' },
      { '@type': 'MusicRecording', name: 'Ya Rab Daptam', position: 4, inAlbum: { '@id': 'https://alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=qDDU7YgwPeY' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': 'https://alisaffudin.com/#album-wolivo',
    name: 'Wolivo',
    url: 'https://alisaffudin.com/?s=wolivo',
    numTracks: 10,
    datePublished: '2022',
    image: 'https://alisaffudin.com/wolivo.webp',
    albumReleaseType: 'https://schema.org/AlbumRelease',
    byArtist: { '@type': 'MusicArtist', '@id': 'https://alisaffudin.com/#artist' },
    sameAs: [
      'https://open.spotify.com/album/5Qn6xtn4tjzf0He630r4XN',
      'https://music.apple.com/in/album/wolivo/1804721802',
      'https://music.youtube.com/playlist?list=OLAK5uy_lOCkO1qrTTKSBaGMoeH_ydFQsgoBx1i0A',
    ],
    track: [
      { '@type': 'MusicRecording', name: 'Zehni Ghulami', position: 1, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=pE52j6i6hjw' },
      { '@type': 'MusicRecording', name: 'Fariyad', position: 2, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=hGsXfL1IQAk' },
      { '@type': 'MusicRecording', name: 'Sleep Song', position: 3, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=_OIzpO3nwbY' },
      { '@type': 'MusicRecording', name: 'Kab Talak', position: 4, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=V5ycgOSmgFo' },
      { '@type': 'MusicRecording', name: 'Behta Gaya', position: 5, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=GF_IvQI6at0' },
      { '@type': 'MusicRecording', name: 'Wadiyon Mei', position: 6, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=JCx5wxEwDM8' },
      { '@type': 'MusicRecording', name: 'Wolivo', position: 7, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=IXDNuj-hXPg' },
      { '@type': 'MusicRecording', name: 'Main Nahin Maanta', position: 8, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=9KNBRvqykPU' },
      { '@type': 'MusicRecording', name: 'Jinki Wajah Se', position: 9, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=7zhY1yReT30' },
      { '@type': 'MusicRecording', name: 'Walo Ha', position: 10, inAlbum: { '@id': 'https://alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=G2AyGm053V8' },
    ],
  },
];

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
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.alisaffudin.com'),
  title: {
    default: 'Ali Saffudin — Kashmiri Singer-Songwriter | Azadi Records',
    template: '%s | Ali Saffudin',
  },
  description: 'Ali Saffudin is a Kashmiri singer-songwriter from Srinagar on Azadi Records — blending Alternative Rock and Blues with Kashmiri Sufi poetry. Stream IRTIQA EP and Wolivo on Spotify, Apple Music, and YouTube.',
  keywords: ['Ali Saffudin', 'Kashmiri singer', 'Kashmiri singer-songwriter', 'Azadi Records', 'Kashmiri music', 'kashmiri sufi music', 'alternative rock Kashmir', 'IRTIQA', 'Wolivo'],
  alternates: {
    canonical: 'https://www.alisaffudin.com',
    languages: {
      'en-IN': 'https://www.alisaffudin.com',
      'en-PK': 'https://www.alisaffudin.com',
      'en': 'https://www.alisaffudin.com',
    },
  },
  openGraph: {
    type: 'profile',
    locale: 'en_IN',
    url: 'https://www.alisaffudin.com',
    siteName: 'Ali Saffudin',
    title: 'Ali Saffudin — Kashmiri Singer-Songwriter | Azadi Records',
    description: 'Ali Saffudin is a Kashmiri singer-songwriter from Srinagar on Azadi Records — blending Alternative Rock and Blues with Kashmiri Sufi poetry.',
    images: [{ url: '/cover.jpg', width: 1200, height: 1200, alt: 'IRTIQA — Ali Saffudin' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Saffudin — Kashmiri Singer-Songwriter | Azadi Records',
    description: 'Ali Saffudin is a Kashmiri singer-songwriter from Srinagar on Azadi Records — blending Alternative Rock and Blues with Kashmiri Sufi poetry.',
    images: ['/cover.jpg'],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.alisaffudin.com/#website',
    name: 'Ali Saffudin',
    url: 'https://www.alisaffudin.com',
    description: 'Official website of Ali Saffudin — Kashmiri Singer-Songwriter',
    author: { '@type': 'MusicArtist', '@id': 'https://www.alisaffudin.com/#artist' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MusicArtist',
    '@id': 'https://www.alisaffudin.com/#artist',
    name: 'Ali Saffudin',
    url: 'https://www.alisaffudin.com',
    image: 'https://www.alisaffudin.com/ali.jpg',
    description: 'Kashmiri singer-songwriter from Hassanabad, Downtown Srinagar, Kashmir. Signed to Azadi Records. Blends Alternative Rock and Blues with Kashmiri Sufi poetry.',
    genre: ['Alternative Rock', 'Blues', 'Kashmiri Folk', 'Sufi', 'Indie Rock'],
    birthPlace: { '@type': 'Place', name: 'Srinagar, Kashmir, India' },
    nationality: { '@type': 'Country', name: 'India' },
    knowsAbout: ['Kashmiri folk music', 'Sufi poetry', 'Alternative Rock', 'Kashmiri language', 'music production'],
    recordLabel: { '@type': 'Organization', name: 'Azadi Records', url: 'https://www.azadirecords.com' },
    sameAs: [
      'https://open.spotify.com/artist/0J3PUchbuLhyRD6RxFQrrE',
      'https://music.apple.com/us/artist/ali-saffudin/1456350962',
      'https://www.youtube.com/channel/UC9ezXxVBdZH7uFwE1Ua57rA',
      'https://music.youtube.com/channel/UCpSS-5kQeow4IGs6Z4dq76w',
      'https://www.instagram.com/alisaffudin',
      'https://www.facebook.com/alisaffu/',
    ],
    album: [
      { '@type': 'MusicAlbum', '@id': 'https://www.alisaffudin.com/#album-irtiqa' },
      { '@type': 'MusicAlbum', '@id': 'https://www.alisaffudin.com/#album-wolivo' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': 'https://www.alisaffudin.com/#album-irtiqa',
    name: 'IRTIQA',
    url: 'https://www.alisaffudin.com/',
    numTracks: 4,
    datePublished: '2026',
    image: 'https://www.alisaffudin.com/cover.jpg',
    albumReleaseType: 'https://schema.org/EPRelease',
    byArtist: { '@type': 'MusicArtist', '@id': 'https://www.alisaffudin.com/#artist' },
    sameAs: [
      'https://open.spotify.com/album/7ywkGokC4VJcQwqSM4CXuN',
      'https://music.apple.com/us/album/irtiqa-ep/6773801507',
      'https://www.youtube.com/playlist?list=OLAK5uy_mGlIUjQvewEWnAZFDXhViSu3fB0VVoGRE',
    ],
    track: [
      { '@type': 'MusicRecording', name: 'Fariyadras', position: 1, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=brnIKzYLdp4' },
      { '@type': 'MusicRecording', name: 'Sui Bulbulah Rach', position: 2, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=IN-s9IAHV7Q' },
      { '@type': 'MusicRecording', name: 'Eid Ayi Tai', position: 3, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=3d5BAnarNMc' },
      { '@type': 'MusicRecording', name: 'Ya Rab Daptam', position: 4, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-irtiqa' }, url: 'https://www.youtube.com/watch?v=qDDU7YgwPeY' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    '@id': 'https://www.alisaffudin.com/#album-wolivo',
    name: 'Wolivo',
    url: 'https://www.alisaffudin.com/?s=wolivo',
    numTracks: 10,
    datePublished: '2022',
    image: 'https://www.alisaffudin.com/wolivo.webp',
    albumReleaseType: 'https://schema.org/AlbumRelease',
    byArtist: { '@type': 'MusicArtist', '@id': 'https://www.alisaffudin.com/#artist' },
    sameAs: [
      'https://open.spotify.com/album/5Qn6xtn4tjzf0He630r4XN',
      'https://music.apple.com/in/album/wolivo/1804721802',
      'https://music.youtube.com/playlist?list=OLAK5uy_lOCkO1qrTTKSBaGMoeH_ydFQsgoBx1i0A',
    ],
    track: [
      { '@type': 'MusicRecording', name: 'Zehni Ghulami', position: 1, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=pE52j6i6hjw' },
      { '@type': 'MusicRecording', name: 'Fariyad', position: 2, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=hGsXfL1IQAk' },
      { '@type': 'MusicRecording', name: 'Sleep Song', position: 3, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=_OIzpO3nwbY' },
      { '@type': 'MusicRecording', name: 'Kab Talak', position: 4, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=V5ycgOSmgFo' },
      { '@type': 'MusicRecording', name: 'Behta Gaya', position: 5, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=GF_IvQI6at0' },
      { '@type': 'MusicRecording', name: 'Wadiyon Mei', position: 6, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=JCx5wxEwDM8' },
      { '@type': 'MusicRecording', name: 'Wolivo', position: 7, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=IXDNuj-hXPg' },
      { '@type': 'MusicRecording', name: 'Main Nahin Maanta', position: 8, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=9KNBRvqykPU' },
      { '@type': 'MusicRecording', name: 'Jinki Wajah Se', position: 9, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=7zhY1yReT30' },
      { '@type': 'MusicRecording', name: 'Walo Ha', position: 10, inAlbum: { '@id': 'https://www.alisaffudin.com/#album-wolivo' }, url: 'https://www.youtube.com/watch?v=G2AyGm053V8' },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is Ali Saffudin?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ali Saffudin is a Kashmiri singer-songwriter from Hassanabad, Downtown Srinagar, Kashmir. He is signed to Azadi Records and creates Alternative Rock and Blues music blended with Kashmiri Sufi poetry, singing in Kashmiri and Urdu.',
        },
      },
      {
        '@type': 'Question',
        name: 'What genre does Ali Saffudin make?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ali Saffudin makes Alternative Rock and Blues music rooted in Kashmiri folk and Sufi poetry traditions. His sound draws from punk, grunge, heavy metal, and folk, sung primarily in the Kashmiri language.',
        },
      },
      {
        '@type': 'Question',
        name: 'What label is Ali Saffudin signed to?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ali Saffudin is signed to Azadi Records, an independent music label based in South Asia known for platforming boundary-pushing artists.',
        },
      },
      {
        '@type': 'Question',
        name: 'What albums has Ali Saffudin released?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ali Saffudin has released two records: Wolivo (2022), a 10-track debut album on Azadi Records, and IRTIQA (2026), a 4-track EP. Both are available on Spotify, Apple Music, and YouTube.',
        },
      },
      {
        '@type': 'Question',
        name: 'Why does Ali Saffudin sing in Kashmiri?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ali Saffudin has described singing in Kashmiri as a political act — a way of preserving the language and culture of Kashmir. As The Guardian noted: "To sing in Kashmiri is political." He draws on the classical Kashmiri folk tradition, reworking ballads by 16th-century poetess Habba Khatoon alongside original compositions.',
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I stream Ali Saffudin\'s music?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ali Saffudin\'s music is available on Spotify (https://open.spotify.com/artist/0J3PUchbuLhyRD6RxFQrrE), Apple Music (https://music.apple.com/us/artist/ali-saffudin/1456350962), and YouTube (https://www.youtube.com/channel/UC9ezXxVBdZH7uFwE1Ua57rA).',
        },
      },
    ],
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
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

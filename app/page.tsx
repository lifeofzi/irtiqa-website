import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

const SECTION_META: Record<string, { title: string; description: string; image: string }> = {
  irtiqa: {
    title: 'IRTIQA EP — Ali Saffudin | Kashmiri Singer-Songwriter | Azadi Records 2026',
    description: 'IRTIQA — the new EP by Kashmiri singer-songwriter Ali Saffudin on Azadi Records. 4 tracks of Alternative Rock blended with Kashmiri Sufi poetry. Stream now on Spotify and Apple Music.',
    image: '/cover.jpg',
  },
  wolivo: {
    title: 'Wolivo — Ali Saffudin | Kashmiri Music | Azadi Records 2022',
    description: 'Wolivo — the 10-track debut album by Kashmiri singer Ali Saffudin on Azadi Records. Stories of a heartland torn apart by conflict. Stream on Spotify, Apple Music, and YouTube.',
    image: '/wolivo.webp',
  },
  about: {
    title: 'About — Ali Saffudin | Kashmiri Singer-Songwriter from Srinagar',
    description: 'Ali Saffudin is a Kashmiri singer-songwriter from Hassanabad, Downtown Srinagar — signed to Azadi Records. His music blends Kashmiri folk, Sufi poetry, punk, and rock.',
    image: '/ali.jpg',
  },
  videos: {
    title: 'Videos — Ali Saffudin | Kashmiri Music Videos',
    description: 'Watch all music videos by Kashmiri singer Ali Saffudin — from Mayi Chani (1.5M views) to the full IRTIQA EP and Wolivo visuals. Alternative Rock and Kashmiri Sufi music.',
    image: '/cover.jpg',
  },
  merch: {
    title: 'Merch — IRTIQA Limited Edition | Ali Saffudin | Ships India',
    description: 'Official IRTIQA merch by Kashmiri singer Ali Saffudin — oversized tees and phone covers. Limited edition. Ships across India.',
    image: '/cover.jpg',
  },
};

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ s?: string }> }
): Promise<Metadata> {
  const { s } = await searchParams;
  const key = s && SECTION_META[s] ? s : 'irtiqa';
  const meta = SECTION_META[key];
  const canonical = key === 'irtiqa' ? 'https://alisaffudin.com/' : `https://alisaffudin.com/?s=${key}`;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: canonical,
      images: [{ url: meta.image }],
    },
    twitter: {
      title: meta.title,
      description: meta.description,
      images: [meta.image],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <HomeClient />
    </Suspense>
  );
}

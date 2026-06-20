import { Suspense } from 'react';
import type { Metadata } from 'next';
import HomeClient from '@/components/HomeClient';

const SECTION_META: Record<string, { title: string; description: string; image: string }> = {
  irtiqa: {
    title: 'IRTIQA EP — Ali Saffudin | New Album 2026',
    description: 'IRTIQA — the new EP by Ali Saffudin. 4 tracks of Alternative Rock blended with Kashmiri Sufi poetry. Stream now on Spotify, Apple Music, and YouTube.',
    image: '/cover.jpg',
  },
  wolivo: {
    title: 'Wolivo — Ali Saffudin | Debut Album 2022',
    description: 'Wolivo — a 10-track debut album by Ali Saffudin on Azadi Records. Stories of a heartland torn apart by conflict. Stream on Spotify, Apple Music, and YouTube.',
    image: '/wolivo.webp',
  },
  about: {
    title: 'About — Ali Saffudin | Kashmiri Singer-Songwriter',
    description: 'Ali Saffudin is from Hassanabad, Downtown Srinagar, Kashmir. His music blends Kashmiri folk, punk, grunge, and rock — moving between grief and defiance.',
    image: '/ali.jpg',
  },
  videos: {
    title: 'Videos — Ali Saffudin | All Music Videos',
    description: 'Watch all music videos by Ali Saffudin — from Mayi Chani (1.5M views) to the full Irtiqa EP and Wolivo visuals. Kashmiri Alternative Rock and Blues.',
    image: '/cover.jpg',
  },
  merch: {
    title: 'Merch — IRTIQA Limited Edition | Ali Saffudin',
    description: 'Limited edition IRTIQA merch — oversized tees, women\'s tees, and phone covers. Official Ali Saffudin merchandise. Ships across India.',
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

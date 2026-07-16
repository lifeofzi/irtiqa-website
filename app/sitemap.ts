import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://alisaffudin.com';
  return [
    { url: base,                     lastModified: new Date('2026-07-01'), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/?s=irtiqa`,      lastModified: new Date('2026-07-01'), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/?s=wolivo`,      lastModified: new Date('2022-09-01'), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/?s=about`,       lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/?s=videos`,      lastModified: new Date('2026-07-01'), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/?s=merch`,       lastModified: new Date('2026-07-01'), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/press`,          lastModified: new Date('2026-07-01'), changeFrequency: 'monthly', priority: 0.6 },
  ];
}

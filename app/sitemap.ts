import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://alisaffudin.com';
  const now = new Date();
  return [
    { url: base,                     lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/?s=wolivo`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/?s=about`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/?s=videos`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/?s=merch`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/press`,          lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];
}

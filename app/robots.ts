import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Explicit positive directives for AI search crawlers
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      // Block admin portal from all crawlers
      { userAgent: '*', allow: '/', disallow: ['/portal', '/api'] },
    ],
    sitemap: 'https://www.alisaffudin.com/sitemap.xml',
  };
}

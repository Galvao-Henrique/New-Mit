import type { MetadataRoute } from 'next';
import { urlDoSite } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = urlDoSite();
  if (!url) return [];
  return ['', '/creditos', '/privacidade'].map((caminho) => ({ url: `${url}${caminho}` }));
}

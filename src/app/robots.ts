import type { MetadataRoute } from 'next';
import { urlDoSite } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  const url = urlDoSite();
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(url ? { sitemap: `${url}/sitemap.xml` } : {}),
  };
}

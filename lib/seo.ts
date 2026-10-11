import type { Metadata } from 'next';
import { getEntrySeo, type BaseEntry } from '@kookee/sdk';
import { getPath } from './paths';
import { SITE_URL } from './site';

export function entrySeo(entry: BaseEntry, siteName: string) {
  return getEntrySeo(entry, { baseUrl: SITE_URL, getPath, siteName });
}

export function entryMetadata(entry: BaseEntry, siteName: string): Metadata {
  const seo = entrySeo(entry, siteName);
  const url = seo.canonical ?? undefined;
  const images = seo.image ? [seo.image] : undefined;
  return {
    // A meta title is written whole, so it skips the layout's "· Site name" suffix.
    title: entry.metaTitle ? { absolute: entry.metaTitle } : entry.title,
    description: seo.description,
    alternates: { canonical: url },
    openGraph:
      seo.type === 'article'
        ? {
            type: 'article',
            title: seo.title,
            description: seo.description,
            url,
            siteName,
            images,
            publishedTime: seo.publishedAt ?? undefined,
            modifiedTime: seo.updatedAt,
          }
        : { type: 'website', title: seo.title, description: seo.description, url, siteName, images },
    twitter: { card: seo.image ? 'summary_large_image' : 'summary' },
  };
}

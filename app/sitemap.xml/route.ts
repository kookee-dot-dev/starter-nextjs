import { buildSitemap } from '@kookee/sdk';
import { exportEntries, getHelpCategories, getProject } from '@/lib/kookee';
import { getPath } from '@/lib/paths';
import { ROADMAP_ENABLED, SITE_URL, STATUS_ENABLED } from '@/lib/site';

export async function GET() {
  const [project, rows, categories] = await Promise.all([getProject(), exportEntries(), getHelpCategories()]);
  // The export holds every locale; this site has pages in the default one only.
  const entries = rows.filter((row) => row.locale === project?.defaultLocale);
  const xml = buildSitemap(entries, {
    baseUrl: SITE_URL,
    getPath,
    extraUrls: [
      '/',
      '/blog',
      '/changelog',
      '/help',
      ...(ROADMAP_ENABLED ? ['/roadmap'] : []),
      ...(STATUS_ENABLED ? ['/status'] : []),
      ...categories.map((category) => `/help/${category.slug}`),
    ],
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

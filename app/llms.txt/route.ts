import { buildLlmsTxt } from '@kookee/sdk';
import { exportEntries, getProject } from '@/lib/kookee';
import { getPath } from '@/lib/paths';
import { SITE_URL } from '@/lib/site';

export async function GET() {
  const [project, rows] = await Promise.all([getProject(), exportEntries()]);
  const entries = rows.filter((row) => row.locale === project?.defaultLocale);
  const text = buildLlmsTxt(entries, {
    baseUrl: SITE_URL,
    getPath,
    siteName: project?.name ?? 'Kookee starter',
    description: 'Blog posts, changelog entries, help articles and pages.',
  });
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}

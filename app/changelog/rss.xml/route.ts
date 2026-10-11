import { buildFeed } from '@kookee/sdk';
import { getProject, newestEntries } from '@/lib/kookee';
import { getPath } from '@/lib/paths';
import { SITE_URL } from '@/lib/site';

export async function GET() {
  const [project, entries] = await Promise.all([getProject(), newestEntries('changelog', 50)]);
  const name = project?.name ?? 'Kookee starter';
  const xml = buildFeed(entries, {
    baseUrl: SITE_URL,
    getPath,
    title: `${name} changelog`,
    description: `What changed in ${name}.`,
    feedPath: '/changelog/rss.xml',
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

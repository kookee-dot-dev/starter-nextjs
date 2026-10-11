import { buildFeed } from '@kookee/sdk';
import { getProject, newestEntries } from '@/lib/kookee';
import { getPath } from '@/lib/paths';
import { SITE_URL } from '@/lib/site';

export async function GET() {
  const [project, posts] = await Promise.all([getProject(), newestEntries('blog', 50)]);
  const name = project?.name ?? 'Kookee starter';
  const xml = buildFeed(posts, {
    baseUrl: SITE_URL,
    getPath,
    title: `${name} blog`,
    description: `The latest posts from ${name}.`,
    feedPath: '/blog/rss.xml',
  });
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}

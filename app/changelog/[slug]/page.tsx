import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChangelogArticle } from '@kookee/react/changelog';
import { Reactions } from '@kookee/react/entry/client';
import { JsonLd } from '@/components/json-ld';
import { getChangelogEntry, getProject, getPublicApiKey, newestEntries } from '@/lib/kookee';
import { PLACEHOLDER_PARAM } from '@/lib/params';
import { getPath } from '@/lib/paths';
import { entryMetadata, entrySeo } from '@/lib/seo';

export async function generateStaticParams() {
  const rows = (await newestEntries('changelog', 20)).filter((row) => getPath(row));
  return rows.length ? rows.map((row) => ({ slug: row.slug! })) : [{ slug: PLACEHOLDER_PARAM }];
}

export async function generateMetadata({ params }: PageProps<'/changelog/[slug]'>): Promise<Metadata> {
  const [entry, project] = await Promise.all([getChangelogEntry((await params).slug), getProject()]);
  return entry && project ? entryMetadata(entry, project.name) : {};
}

export default async function ChangelogEntryPage({ params }: PageProps<'/changelog/[slug]'>) {
  const { slug } = await params;
  const [entry, project] = await Promise.all([getChangelogEntry(slug), getProject()]);
  const apiKey = getPublicApiKey();
  if (!entry || !project || !getPath(entry)) notFound();

  return (
    <div className="site-container site-narrow">
      <JsonLd data={entrySeo(entry, project.name).jsonLd} />
      <article className="site-article">
        <ChangelogArticle entry={entry} showLink />
        <Reactions entryId={entry.id} reactions={entry.reactions} config={apiKey ? { apiKey } : null} />
      </article>
    </div>
  );
}

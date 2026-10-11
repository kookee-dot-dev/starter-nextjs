import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EntryContent } from '@kookee/react/entry';
import { JsonLd } from '@/components/json-ld';
import { getPage, getProject, newestEntries } from '@/lib/kookee';
import { PLACEHOLDER_PARAM } from '@/lib/params';
import { getPath } from '@/lib/paths';
import { entryMetadata, entrySeo } from '@/lib/seo';

export async function generateStaticParams() {
  const rows = (await newestEntries('page', 20)).filter((row) => getPath(row));
  return rows.length ? rows.map((row) => ({ slug: row.slug! })) : [{ slug: PLACEHOLDER_PARAM }];
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const [page, project] = await Promise.all([getPage((await params).slug), getProject()]);
  return page && project && getPath(page) ? entryMetadata(page, project.name) : {};
}

export default async function KookeePage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const [page, project] = await Promise.all([getPage(slug), getProject()]);
  if (!page || !project || !getPath(page)) notFound();

  return (
    <div className="site-container site-narrow">
      <JsonLd data={entrySeo(page, project.name).jsonLd} />
      <article className="site-article">
        <h1 className="site-title">{page.title}</h1>
        <EntryContent entry={page} className="kookee-typography" />
      </article>
    </div>
  );
}

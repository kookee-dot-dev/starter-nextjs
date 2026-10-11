import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChangelogListPage } from '@/components/changelog-list-page';
import { parseListPage } from '@/lib/params';

export function generateStaticParams() {
  return [{ page: '2' }];
}

export async function generateMetadata({ params }: PageProps<'/changelog/page/[page]'>): Promise<Metadata> {
  const { page } = await params;
  return { title: `Changelog, page ${page}`, alternates: { canonical: `/changelog/page/${page}` } };
}

export default async function ChangelogListPageRoute({ params }: PageProps<'/changelog/page/[page]'>) {
  const page = parseListPage((await params).page);
  if (!page) notFound();
  return <ChangelogListPage page={page} />;
}

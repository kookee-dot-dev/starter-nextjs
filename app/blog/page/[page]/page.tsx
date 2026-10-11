import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogListPage } from '@/components/blog-list-page';
import { parseListPage } from '@/lib/params';

export function generateStaticParams() {
  return [{ page: '2' }];
}

export async function generateMetadata({ params }: PageProps<'/blog/page/[page]'>): Promise<Metadata> {
  const { page } = await params;
  return { title: `Blog, page ${page}`, alternates: { canonical: `/blog/page/${page}` } };
}

export default async function BlogListPageRoute({ params }: PageProps<'/blog/page/[page]'>) {
  const page = parseListPage((await params).page);
  if (!page) notFound();
  return <BlogListPage page={page} />;
}

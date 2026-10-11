import type { Metadata } from 'next';
import { BlogListPage } from '@/components/blog-list-page';

export const metadata: Metadata = { title: 'Blog', alternates: { canonical: '/blog' } };

export default function BlogPage() {
  return <BlogListPage page={1} />;
}

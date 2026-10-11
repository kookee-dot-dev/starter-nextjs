import { notFound } from 'next/navigation';
import { BlogPostList } from '@kookee/react/blog';
import { Pagination } from '@kookee/react/entry';
import { renderLink } from '@/components/link';
import { listBlogPosts } from '@/lib/kookee';
import { getPath, listPath } from '@/lib/paths';

export async function BlogListPage({ page }: { page: number }) {
  const posts = await listBlogPosts(page);
  if (!posts) return null;
  if (page > 1 && page > posts.totalPages) notFound();

  return (
    <div className="site-container">
      <h1 className="site-title">Blog</h1>
      <BlogPostList posts={posts.data} href={getPath} renderLink={renderLink} />
      <Pagination
        page={page}
        totalPages={posts.totalPages}
        href={(target) => listPath('/blog', target)}
        renderLink={renderLink}
        className="site-pagination"
      />
    </div>
  );
}

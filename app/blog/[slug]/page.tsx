import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost } from '@kookee/react/blog';
import { extractHeadings } from '@kookee/react/entry';
import { Reactions, TrackedTableOfContents } from '@kookee/react/entry/client';
import { JsonLd } from '@/components/json-ld';
import { renderLink } from '@/components/link';
import { getBlogPost, getProject, getPublicApiKey, newestEntries } from '@/lib/kookee';
import { PLACEHOLDER_PARAM } from '@/lib/params';
import { getPath } from '@/lib/paths';
import { entryMetadata, entrySeo } from '@/lib/seo';

export async function generateStaticParams() {
  const rows = (await newestEntries('blog', 20)).filter((row) => getPath(row));
  return rows.length ? rows.map((row) => ({ slug: row.slug! })) : [{ slug: PLACEHOLDER_PARAM }];
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const [post, project] = await Promise.all([getBlogPost((await params).slug), getProject()]);
  return post && project ? entryMetadata(post, project.name) : {};
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const [post, project] = await Promise.all([getBlogPost(slug), getProject()]);
  const apiKey = getPublicApiKey();
  if (!post || !project || !getPath(post)) notFound();

  return (
    <div className="site-container site-article-layout">
      <JsonLd data={entrySeo(post, project.name).jsonLd} />
      <article className="site-article">
        <BlogPost post={post} renderLink={renderLink} />
        <Reactions entryId={post.id} reactions={post.reactions} config={apiKey ? { apiKey } : null} />
      </article>
      <aside className="site-aside">
        <TrackedTableOfContents headings={extractHeadings(post.contentHtml)} offset={88} resetKey={post.id} />
      </aside>
    </div>
  );
}

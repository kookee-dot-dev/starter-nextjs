import Link from 'next/link';
import { BlogPostList } from '@kookee/react/blog';
import { ChangelogList } from '@kookee/react/changelog';
import { HelpCategoryGrid } from '@kookee/react/help';
import { renderLink } from '@/components/link';
import { getHelpCategories, getProject, listBlogPosts, listChangelog } from '@/lib/kookee';
import { getPath, hrefs } from '@/lib/paths';

export default async function HomePage() {
  const [project, posts, changelog, categories] = await Promise.all([
    getProject(),
    listBlogPosts(1),
    listChangelog(1),
    getHelpCategories(),
  ]);
  if (!project) return null;

  return (
    <div className="site-container site-stack">
      <section className="site-hero">
        <h1>{project.name}</h1>
        <p>News, product updates and answers, in one place.</p>
      </section>

      {posts && posts.data.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Latest posts" href="/blog" />
          <BlogPostList posts={posts.data.slice(0, 3)} href={getPath} renderLink={renderLink} />
        </section>
      )}

      {changelog && changelog.data.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Recent updates" href="/changelog" />
          <ChangelogList entries={changelog.data.slice(0, 3)} href={getPath} renderLink={renderLink} />
        </section>
      )}

      {categories.length > 0 && (
        <section className="site-section">
          <SectionHeading title="Help center" href="/help" />
          <HelpCategoryGrid categories={categories} href={hrefs.helpCategory} renderLink={renderLink} />
        </section>
      )}
    </div>
  );
}

function SectionHeading({ title, href }: { title: string; href: string }) {
  return (
    <div className="site-section-heading">
      <h2>{title}</h2>
      <Link href={href}>View all</Link>
    </div>
  );
}

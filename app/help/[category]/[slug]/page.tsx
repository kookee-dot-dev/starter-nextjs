import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { extractHeadings } from '@kookee/react/entry';
import { TrackedTableOfContents } from '@kookee/react/entry/client';
import { HelpArticle, HelpArticleNav, HelpBreadcrumbs } from '@kookee/react/help';
import { HelpfulVote } from '@kookee/react/help/client';
import { JsonLd } from '@/components/json-ld';
import { renderLink } from '@/components/link';
import { getHelpArticle, getProject, getPublicApiKey, listHelpArticles, newestEntries } from '@/lib/kookee';
import { PLACEHOLDER_PARAM } from '@/lib/params';
import { getPath, hrefs } from '@/lib/paths';
import { entryMetadata, entrySeo } from '@/lib/seo';

export async function generateStaticParams() {
  const rows = (await newestEntries('help_article', 20)).filter((row) => row.category && getPath(row));
  return rows.length
    ? rows.map((row) => ({ category: row.category!.slug, slug: row.slug! }))
    : [{ category: PLACEHOLDER_PARAM, slug: PLACEHOLDER_PARAM }];
}

async function readArticle(category: string, slug: string) {
  const article = await getHelpArticle(slug);
  // An article lives under its own category only; one without a category has no page.
  return article && article.category?.slug === category ? article : null;
}

export async function generateMetadata({ params }: PageProps<'/help/[category]/[slug]'>): Promise<Metadata> {
  const { category, slug } = await params;
  const [article, project] = await Promise.all([readArticle(category, slug), getProject()]);
  return article && project ? entryMetadata(article, project.name) : {};
}

export default async function HelpArticlePage({ params }: PageProps<'/help/[category]/[slug]'>) {
  const { category, slug } = await params;
  const [article, siblings, project] = await Promise.all([
    readArticle(category, slug),
    listHelpArticles(category),
    getProject(),
  ]);
  const apiKey = getPublicApiKey();
  if (!article || !article.category || !project) notFound();

  return (
    <div className="site-container site-article-layout">
      <JsonLd data={entrySeo(article, project.name).jsonLd} />
      <article className="site-article">
        <HelpBreadcrumbs
          homeHref="/help"
          category={article.category}
          categoryHref={hrefs.helpCategory}
          article={article}
          renderLink={renderLink}
        />
        <HelpArticle article={article} />
        <HelpfulVote entryId={article.id} reactions={article.reactions} config={apiKey ? { apiKey } : null} />
      </article>
      <aside className="site-aside">
        <TrackedTableOfContents headings={extractHeadings(article.contentHtml)} offset={88} resetKey={article.id} />
        <HelpArticleNav
          articles={siblings}
          activeSlug={article.slug ?? undefined}
          href={hrefs.helpArticle}
          title={article.category.name}
          renderLink={renderLink}
        />
      </aside>
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HelpArticleList, HelpBreadcrumbs, HelpCategoryHeader, HelpCategoryNav } from '@kookee/react/help';
import { renderLink } from '@/components/link';
import { getHelpCategories, listHelpArticles } from '@/lib/kookee';
import { PLACEHOLDER_PARAM } from '@/lib/params';
import { hrefs } from '@/lib/paths';

export async function generateStaticParams() {
  const categories = await getHelpCategories();
  return categories.length
    ? categories.map((category) => ({ category: category.slug }))
    : [{ category: PLACEHOLDER_PARAM }];
}

export async function generateMetadata({ params }: PageProps<'/help/[category]'>): Promise<Metadata> {
  const { category: slug } = await params;
  const category = (await getHelpCategories()).find((item) => item.slug === slug);
  return category
    ? {
        title: category.name,
        description: category.description ?? undefined,
        alternates: { canonical: `/help/${category.slug}` },
      }
    : {};
}

export default async function HelpCategoryPage({ params }: PageProps<'/help/[category]'>) {
  const { category: slug } = await params;
  const [categories, articles] = await Promise.all([getHelpCategories(), listHelpArticles(slug)]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <div className="site-container site-article-layout">
      <div className="site-article">
        <HelpBreadcrumbs
          homeHref="/help"
          category={category}
          categoryHref={hrefs.helpCategory}
          renderLink={renderLink}
        />
        <HelpCategoryHeader category={category} />
        <HelpArticleList articles={articles} href={hrefs.helpArticle} renderLink={renderLink} />
      </div>
      <aside className="site-aside">
        <HelpCategoryNav
          categories={categories}
          activeCategorySlug={category.slug}
          href={hrefs.helpCategory}
          renderLink={renderLink}
          showCounts
        />
      </aside>
    </div>
  );
}

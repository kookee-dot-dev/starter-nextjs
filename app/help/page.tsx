import type { Metadata } from 'next';
import { HelpCategoryGrid } from '@kookee/react/help';
import { HelpSearch } from '@/components/help-search';
import { renderLink } from '@/components/link';
import { getHelpCategories, getPublicApiKey } from '@/lib/kookee';
import { hrefs } from '@/lib/paths';

export const metadata: Metadata = { title: 'Help center', alternates: { canonical: '/help' } };

export default async function HelpPage() {
  const categories = await getHelpCategories();
  const apiKey = getPublicApiKey();
  if (!apiKey) return null;

  return (
    <div className="site-container">
      <section className="site-help-hero">
        <h1 className="site-title">How can we help?</h1>
        <HelpSearch apiKey={apiKey} />
      </section>
      <HelpCategoryGrid categories={categories} href={hrefs.helpCategory} renderLink={renderLink} />
    </div>
  );
}

import type { Metadata } from 'next';
import '@kookee/react/content.css';
import '@kookee/sdk/styles/content.css';
import './site.css';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Setup } from '@/components/setup';
import { SiteWidget } from '@/components/site-widget';
import { getPublicApiKey, getProject, listAnnouncements, listChangelog, newestEntries } from '@/lib/kookee';
import { SITE_URL } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject();
  const name = project?.name ?? 'Kookee starter';
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s · ${name}` },
    alternates: {
      types: {
        'application/rss+xml': [
          { url: '/blog/rss.xml', title: `${name} blog` },
          { url: '/changelog/rss.xml', title: `${name} changelog` },
        ],
      },
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const [project, changelog, pages, announcements] = await Promise.all([
    getProject(),
    listChangelog(1),
    newestEntries('page', 20),
    listAnnouncements(),
  ]);
  const apiKey = getPublicApiKey();

  return (
    <html lang={project?.defaultLocale ?? 'en'} className="kookee-auto">
      <body>
        {project && apiKey ? (
          <>
            <Header project={project} changelog={changelog?.data ?? []} announcements={announcements} />
            <main className="site-main">{children}</main>
            <Footer project={project} pages={pages} />
            {project.widgetConfigured && <SiteWidget apiKey={apiKey} />}
          </>
        ) : (
          // Without a key every page renders nothing, so the setup notice is all a visitor sees.
          <main className="site-main">
            <Setup />
            {children}
          </main>
        )}
      </body>
    </html>
  );
}

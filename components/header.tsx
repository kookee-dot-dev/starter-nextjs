import Link from 'next/link';
import type { AnnouncementDetail, ChangelogEntryListItem, PublicProject } from '@kookee/sdk';
import { WhatsNew } from '@kookee/react/changelog/client';
import { Announcements } from '@/components/announcements';
import { hrefs } from '@/lib/paths';
import { ROADMAP_ENABLED, STATUS_ENABLED } from '@/lib/site';

export function Header({
  project,
  changelog,
  announcements,
}: {
  project: PublicProject;
  changelog: ChangelogEntryListItem[];
  announcements: AnnouncementDetail[];
}) {
  return (
    <header className="site-header">
      <div className="site-container site-header-inner">
        <Link href="/" className="site-brand">
          {project.name}
        </Link>
        <nav aria-label="Main" className="site-nav">
          <Link href="/blog">Blog</Link>
          <Link href="/changelog">Changelog</Link>
          <Link href="/help">Help</Link>
          {ROADMAP_ENABLED && <Link href="/roadmap">Roadmap</Link>}
          {STATUS_ENABLED && <Link href="/status">Status</Link>}
          {project.portalUrl && <a href={project.portalUrl}>Portal ↗</a>}
        </nav>
        <WhatsNew entries={changelog} href={hrefs.changelogEntry} allHref="/changelog" />
      </div>
      <Announcements announcements={announcements} />
    </header>
  );
}

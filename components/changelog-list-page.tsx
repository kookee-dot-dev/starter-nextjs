import { notFound } from 'next/navigation';
import { ChangelogList } from '@kookee/react/changelog';
import { Pagination } from '@kookee/react/entry';
import { renderLink } from '@/components/link';
import { listChangelog } from '@/lib/kookee';
import { getPath, listPath } from '@/lib/paths';

export async function ChangelogListPage({ page }: { page: number }) {
  const entries = await listChangelog(page);
  if (!entries) return null;
  if (page > 1 && page > entries.totalPages) notFound();

  return (
    <div className="site-container site-narrow">
      <h1 className="site-title">Changelog</h1>
      <ChangelogList entries={entries.data} href={getPath} renderLink={renderLink} />
      <Pagination
        page={page}
        totalPages={entries.totalPages}
        href={(target) => listPath('/changelog', target)}
        renderLink={renderLink}
        className="site-pagination"
      />
    </div>
  );
}

import type { Metadata } from 'next';
import { ChangelogListPage } from '@/components/changelog-list-page';

export const metadata: Metadata = { title: 'Changelog', alternates: { canonical: '/changelog' } };

export default function ChangelogPage() {
  return <ChangelogListPage page={1} />;
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StatusHeadline, StatusOverview } from '@kookee/react/status';
import { renderLink } from '@/components/link';
import { getProject, getStatus } from '@/lib/kookee';
import { STATUS_ENABLED } from '@/lib/site';

export async function generateMetadata(): Promise<Metadata> {
  const project = await getProject();
  return {
    title: 'Status',
    description: project ? `Current status, incidents and uptime of ${project.name}.` : undefined,
    alternates: { canonical: '/status' },
  };
}

export default async function StatusPage() {
  if (!STATUS_ENABLED) notFound();
  const status = await getStatus();
  if (!status) return null;

  return (
    <div className="site-container site-narrow">
      <StatusHeadline status={status} className="site-status-headline" />
      <p className="site-lead">Incidents, maintenance and the uptime of the last 90 days.</p>
      <StatusOverview status={status} incidentHref="/status/incidents/{id}" renderLink={renderLink} />
    </div>
  );
}

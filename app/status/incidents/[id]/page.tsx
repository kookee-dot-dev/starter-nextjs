import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StatusIncidentArticle } from '@kookee/react/status';
import { getStatus, getStatusIncident } from '@/lib/kookee';
import { PLACEHOLDER_PARAM } from '@/lib/params';
import { STATUS_ENABLED } from '@/lib/site';

export async function generateStaticParams() {
  const status = STATUS_ENABLED ? await getStatus() : null;
  const open = status ? [...status.activeIncidents, ...status.maintenanceInProgress, ...status.upcomingMaintenance] : [];
  return open.length ? open.map((incident) => ({ id: incident.id })) : [{ id: PLACEHOLDER_PARAM }];
}

export async function generateMetadata({ params }: PageProps<'/status/incidents/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const incident = STATUS_ENABLED ? await getStatusIncident(id) : null;
  return incident ? { title: incident.title, alternates: { canonical: `/status/incidents/${incident.id}` } } : {};
}

export default async function StatusIncidentPage({ params }: PageProps<'/status/incidents/[id]'>) {
  if (!STATUS_ENABLED) notFound();
  const incident = await getStatusIncident((await params).id);
  if (!incident) notFound();

  return (
    <div className="site-container site-narrow">
      <Link href="/status" className="site-back">
        ← Status
      </Link>
      <StatusIncidentArticle incident={incident} />
    </div>
  );
}

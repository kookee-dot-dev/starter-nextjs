import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Roadmap } from '@kookee/react/roadmap';
import { getProject, getRoadmap } from '@/lib/kookee';
import { ROADMAP_ENABLED } from '@/lib/site';

export const metadata: Metadata = { title: 'Roadmap', alternates: { canonical: '/roadmap' } };

export default async function RoadmapPage() {
  if (!ROADMAP_ENABLED) notFound();
  const [roadmap, project] = await Promise.all([getRoadmap(), getProject()]);
  if (!roadmap || !project) return null;

  return (
    <div className="site-container">
      <h1 className="site-title">Roadmap</h1>
      <p className="site-lead">
        What we are working on and what is under consideration.
        {project.portalUrl && (
          <>
            {' '}
            Vote and share ideas on <a href={project.portalUrl}>our portal</a>.
          </>
        )}
      </p>
      <Roadmap columns={roadmap.columns} posts={roadmap.posts} />
    </div>
  );
}

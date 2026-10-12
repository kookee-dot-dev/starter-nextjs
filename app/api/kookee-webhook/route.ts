import { revalidateTag } from 'next/cache';
import { Webhook, WebhookVerificationError } from 'standardwebhooks';

type KookeeEvent = { type: string; data?: { type?: string } };

const SITE_TYPES = new Set(['blog', 'changelog', 'help_article', 'page']);

/** Refreshes the pages that show an entry, or the status page, as soon as Kookee reports a change. */
export async function POST(request: Request) {
  const secret = process.env.KOOKEE_WEBHOOK_SECRET;
  if (!secret) return new Response(null, { status: 404 });

  let event: KookeeEvent;
  try {
    event = new Webhook(secret).verify(await request.text(), Object.fromEntries(request.headers)) as KookeeEvent;
  } catch (error) {
    if (error instanceof WebhookVerificationError) return new Response(null, { status: 401 });
    throw error;
  }

  // Incidents and monitors carry no entry type. A status page is read during an incident, so the
  // next visit waits for the current one.
  if (event.type.startsWith('incident.') || event.type.startsWith('monitor.')) {
    revalidateTag('kookee:status', { expire: 0 });
    return new Response(null, { status: 204 });
  }

  const entryType = event.data?.type;
  if (entryType && SITE_TYPES.has(entryType)) {
    const tag = `kookee:${entryType}`;
    switch (event.type) {
      case 'entry.published':
      case 'entry.updated':
        // The next visit gets the current page and starts the refresh.
        revalidateTag(tag, 'max');
        break;
      case 'entry.unpublished':
      case 'entry.deleted':
        // The next visit waits for a page without the removed entry.
        revalidateTag(tag, { expire: 0 });
        break;
    }
  }

  return new Response(null, { status: 204 });
}

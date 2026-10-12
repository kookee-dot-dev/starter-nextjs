import type { NextConfig } from 'next';

const revalidate = Number(process.env.KOOKEE_REVALIDATE_SECONDS) || 21600;

export default {
  cacheComponents: true,
  partialPrefetching: false,
  cacheLife: {
    kookee: { revalidate },
    // A status page is read during an incident, so it is refreshed every minute, and a client
    // navigation reuses a copy for 30 seconds, not the router's default 5 minutes. `expire` stays
    // at 5 minutes: a shorter one counts as short-lived, and /status could no longer be prerendered.
    'kookee-status': { stale: 30, revalidate: 60, expire: 300 },
  },
} satisfies NextConfig;

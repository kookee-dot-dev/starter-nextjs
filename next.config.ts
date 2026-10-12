import type { NextConfig } from 'next';

const revalidate = Number(process.env.KOOKEE_REVALIDATE_SECONDS) || 21600;

export default {
  cacheComponents: true,
  partialPrefetching: false,
  cacheLife: {
    kookee: { revalidate },
    // A status page is read during an incident, so it is at most a minute old, and a client
    // navigation reuses a copy for 30 seconds, not the router's default 5 minutes.
    'kookee-status': { stale: 30, revalidate: 60, expire: 60 },
  },
} satisfies NextConfig;

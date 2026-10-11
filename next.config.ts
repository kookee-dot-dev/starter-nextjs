import type { NextConfig } from 'next';

const revalidate = Number(process.env.KOOKEE_REVALIDATE_SECONDS) || 21600;

export default {
  cacheComponents: true,
  partialPrefetching: false,
  cacheLife: { kookee: { revalidate } },
} satisfies NextConfig;

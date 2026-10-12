export const SITE_URL = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/+$/, '');

export const ROADMAP_ENABLED = process.env.KOOKEE_ROADMAP !== 'false';
export const STATUS_ENABLED = process.env.KOOKEE_STATUS === 'true';

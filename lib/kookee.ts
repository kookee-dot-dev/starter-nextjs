import 'server-only';
import { Kookee, KookeeApiError } from '@kookee/sdk';
import { cacheLife, cacheTag } from 'next/cache';
import { getPath } from './paths';

export const PAGE_SIZE = 12;

/** Kookee's slug format. Anything else is a 404 without a request, which stops bot probes. */
const SLUG_PATTERN = /^[a-z0-9-]+$/;

export const SITE_TYPES = ['blog', 'changelog', 'help_article', 'page'] as const;
export type SiteType = (typeof SITE_TYPES)[number];

/** The client, or `null` while `KOOKEE_API_KEY` is not set. */
export function getKookee(): Kookee | null {
  const apiKey = process.env.KOOKEE_API_KEY;
  return apiKey ? new Kookee({ apiKey, timeoutMs: 10_000, getPath }) : null;
}

/** The key the browser pieces (reactions, helpful vote, help search, widget) send. It is public by design. */
export function getPublicApiKey(): string | null {
  return process.env.KOOKEE_API_KEY || null;
}

async function orNull<T>(read: Promise<T>): Promise<T | null> {
  try {
    return await read;
  } catch (error) {
    if (error instanceof KookeeApiError && error.status === 404) return null;
    throw error;
  }
}

export async function getProject() {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee');
  return (await getKookee()?.project.get()) ?? null;
}

export async function listBlogPosts(page: number) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:blog');
  return (await getKookee()?.blog.list({ page, limit: PAGE_SIZE })) ?? null;
}

export async function listChangelog(page: number) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:changelog');
  return (await getKookee()?.changelog.list({ page, limit: PAGE_SIZE })) ?? null;
}

export async function getBlogPost(slug: string) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:blog');
  const kookee = getKookee();
  if (!kookee || !SLUG_PATTERN.test(slug)) return null;
  return orNull(kookee.blog.getBySlug(slug));
}

export async function getChangelogEntry(slug: string) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:changelog');
  const kookee = getKookee();
  if (!kookee || !SLUG_PATTERN.test(slug)) return null;
  return orNull(kookee.changelog.getBySlug(slug));
}

export async function getHelpArticle(slug: string) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:help_article');
  const kookee = getKookee();
  if (!kookee || !SLUG_PATTERN.test(slug)) return null;
  return orNull(kookee.help.getBySlug(slug));
}

export async function getPage(slug: string) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:page');
  const kookee = getKookee();
  if (!kookee || !SLUG_PATTERN.test(slug)) return null;
  return orNull(kookee.pages.getBySlug(slug));
}

export async function getHelpCategories() {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:help_article');
  return (await getKookee()?.help.categories()) ?? [];
}

export async function listHelpArticles(category: string) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:help_article');
  const kookee = getKookee();
  if (!kookee || !SLUG_PATTERN.test(category)) return [];
  return (await kookee.help.list({ category, limit: 100 })).data;
}

export async function getRoadmap() {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', 'kookee:feedback');
  const kookee = getKookee();
  if (!kookee) return null;
  const [columns, posts] = await Promise.all([
    kookee.feedback.getColumns(),
    kookee.feedback.list({ sort: 'top', limit: 100, columnType: 'open' }),
  ]);
  // Only open posts are read, so closed columns (Done, Declined) would render empty.
  return { columns: columns.filter((column) => column.type === 'open'), posts: posts.data };
}

/** Every published entry of the four types, in every locale; callers keep the default locale. */
export async function exportEntries() {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', ...SITE_TYPES.map((type) => `kookee:${type}`));
  return (await getKookee()?.entries.export({ type: [...SITE_TYPES] })) ?? [];
}

/** The newest entries of one type, in the default locale: for static params and feeds. */
export async function newestEntries(type: SiteType, limit: number) {
  'use cache';
  cacheLife('kookee');
  cacheTag('kookee', `kookee:${type}`);
  return (await getKookee()?.entries.list({ type, limit }))?.data ?? [];
}

'use client';

import { HelpSearchBox } from '@kookee/react/help/client';
import { useRouter } from 'next/navigation';
import { hrefs } from '@/lib/paths';

export function HelpSearch({ apiKey }: { apiKey: string }) {
  const router = useRouter();
  return <HelpSearchBox config={{ apiKey }} href={hrefs.helpArticle} navigate={(href) => router.push(href)} />;
}

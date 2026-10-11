'use client';

import dynamic from 'next/dynamic';

// The widget carries a markdown renderer and a syntax highlighter, so it loads after the page.
const ChatWidget = dynamic(() => import('./chat-widget').then((module) => module.ChatWidget), { ssr: false });

export function SiteWidget({ apiKey }: { apiKey: string }) {
  return <ChatWidget apiKey={apiKey} />;
}

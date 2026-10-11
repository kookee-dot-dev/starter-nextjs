'use client';

import { KookeeChatWidget } from '@kookee/react/chat';
import '@kookee/react/chat.css';

export function ChatWidget({ apiKey }: { apiKey: string }) {
  return <KookeeChatWidget clientOptions={{ apiKey }} theme="auto" />;
}

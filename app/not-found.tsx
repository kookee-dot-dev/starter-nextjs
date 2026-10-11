import Link from 'next/link';
import { getPublicApiKey } from '@/lib/kookee';

export default function NotFound() {
  if (!getPublicApiKey()) return null;
  return (
    <div className="site-container site-empty">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist, or it was moved.</p>
      <Link href="/">Go to the home page</Link>
    </div>
  );
}
